import {
    wrapval,
    typedef,
    typeinit,
    bool,
    int32,
    float64,
    string,
    unknown,
} from 'rainforest-js'
export const Box = typedef({
    x1: float64,
    y1: float64,
    x2: float64,
    y2: float64
})
export const EnumTrackState = ({
    NORMAL: 1, //object is visible from the screen
    NEVER_TRACKED: 0, //object has never appeared in the screen
    HIDE: 2, //object seems be hide by other object
    OUT_OFF_SCREEN: 3 //object seems removed from the screen
})
export let TrackingObject = typedef({
    classId: string, //classId is defined by the Backend for each object.
    box: Box, //position of this object
    lastTrackedTime: float64, //last time this object tracked
    state: int32, //type is EnumTrackState (0 | 1 | 2 | 3)
    hider: unknown, //type is TrackingObject, but typing it causes reference error. Only nonnull when state == EnumTrackState.HIDE
    des: string
})
export let trackingObjects = [];
export let screenWidth = 1,
    screenHeight = 1;
let looksLikeSameBox = function(box1, box2, errorRate) {
    let right1 = box1.x1 + box1.x2;
    let bottom1 = box1.y1 + box1.y2;
    let right2 = box2.x1 + box2.x2;
    let bottom2 = box2.y1 + box2.y2;
    let intersectionW = Math.max(0, Math.min(right1, right2) - Math.max(box1.x1, box2.x1));
    let intersectionH = Math.max(0, Math.min(bottom1, bottom2) - Math.max(box1.y1, box2.y1));
    return (Math.abs(box1.x2 - intersectionW) < box1.x2 * errorRate && Math.abs(box1.y2 - intersectionH) < box1.y2 * errorRate)
}
// called by this.Idle() - judge a missing object why disappeared (removed from screen / hide by other object)
let judgeDisappearReason = function(obj) {
        let hider = findHider(obj);
        if (hider) {
            obj.state = EnumTrackState.HIDE;
            obj.des = "物体被其他物体遮蔽";
            obj.hider = hider;
        } else { //maybe hide by unknown objects, so need judge the dist from screen borders.
            let box = obj.box;
            let cx = (obj.x1 + box.x2) / 2,
                cy = (box.y1 + box.y2) / 2;
            let w = Math.abs(box.x1 - box.x2),
                h = Math.abs(box.y1 - box.y2);
            let dx = Math.min(cx, screenWidth - cx) - w / 2,
                dy = Math.min(cy, screenHeight - cy) - h / 2;
            let rate = 0.2; //TODO: need find adjust rate
            if (dx < screenWidth * rate || dy < screenHeight * rate) {
                obj.state = EnumTrackState.OUT_OFF_SCREEN;
                obj.des = "物体被移出屏幕";
            } else {
                obj.state = EnumTrackState.HIDE; //hide by unknown object (paper...?)
                obj.des = "物体被其他物体遮蔽";
            }
            obj.hider = undefined;
        }
    }
    // called by this.JudgeDisappearReason(obj)
let findHider = function(obj) {
    let box = obj.box;
    for (const eachObj of trackingObjects) {
        let eachBox = eachObj.box;
        let errorRate = 0.2; //TODO: need find adjust rate
        if (eachObj.state === EnumTrackState.NORMAL && looksLikeSameBox(box, eachBox, errorRate)) {
            return eachObj;
        }
    }
    return undefined;
}
export default class TrackingSystem {
    StartAddTrackData() {
        //reset all tracking state to HIDE.
        trackingObjects.forEach(function(eachObj) {
            eachObj.state = EnumTrackState.HIDE;
            eachObj.des = "物体被其他物体遮蔽";
        })
    }
    EndAddTrackData() {
        //check any state still == HIDE
        for (const missingObj of trackingObjects) {
            if (missingObj.state !== EnumTrackState.HIDE)
                continue;
            judgeDisappearReason(missingObj);
        }
    }
    AddTrackData(reliability, classId, x1, y1, x2, y2) {
        if (reliability > 0.6) {
            let box = typeinit(Box);
            box.x1 = x1;
            box.y1 = y1;
            box.x2 = x2;
            box.y2 = y2;
            let cx = box.x1 + box.x2/2;
            let cy = box.x1 + box.x2/2;
            let missing = true;
            for (const eachObj of trackingObjects) {
                console.log(eachObj.classId + "vs" + classId + "result: " + (eachObj.classId === classId));
                if (eachObj.classId !== classId || eachObj.state === EnumTrackState.NORMAL) // same classID & avoid redefinition
                    continue;
                let eachBox = eachObj.box;
                let errorRate = 0.2; //TODO: find adjust rate
                if (looksLikeSameBox(eachBox, box, errorRate)) {
                    eachObj.box = box;
                    eachObj.state = EnumTrackState.NORMAL;
                    eachObj.des = "物体正常显示";
                    eachObj.lastTrackedTime = new Date().getTime();
                    console.log("AddTrackData: " + classId + " is moved from " + (eachBox.x1 + eachBox.x2/2) + ", " + (eachBox.y1 + eachBox.y2/2) + " to " + cx + ", " + cy);
                    missing = false;
                    break;
                }
            }
            if (missing) { //new object appeared on screen
                let obj = typeinit(TrackingObject)
                obj.classId = classId;
                obj.box = box;
                obj.state = EnumTrackState.NORMAL;
                obj.des = "物体正常显示";
                obj.lastTrackedTime = new Date().getTime();
                obj.hider = undefined;
                console.log("accepted: " + classId + " at pos " + cx + ", " + cy);
                trackingObjects.push(obj);
            }
        } else {
            console.log("refused low reliability: " + reliability + " of: " + classId);
        }
    }
    FindObject(description) {
        let candidates_normal = [];
        let candidates_missing = [];
        for (const eachObj of trackingObjects) {
            let indexOf = description.indexOf(eachObj.classId);
            console.log("FindObject: compare " + description + " vs " + eachObj.classId + " indexOf: " + indexOf);
            if (indexOf >= 0) {
                switch (eachObj.state) {
                    case EnumTrackState.NORMAL:
                        candidates_normal.push(eachObj);
                        break;
                    case EnumTrackState.HIDE:
                    case EnumTrackState.OUT_OFF_SCREEN:
                        candidates_missing.push(eachObj);
                        break;
                }
            }
        }
        let results = [];
        candidates_missing.sort((obj1, obj2) => obj1.lastTrackedTime - obj2.lastTrackedTime)
        for (const eachObj of candidates_normal) {
            results.push(eachObj);
        }
        for (const eachObj of candidates_missing) {
            results.push(eachObj);
        }
        return results;
    }
}
