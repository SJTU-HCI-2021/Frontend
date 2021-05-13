<template>
  <div>
    Speech: <vue-speech lang="zh-CN" @onTranscriptionEnd="onEnd"/>
  </div>
</template>

<script>
  export default {
    methods: {
      onEnd ({ lastSentence, transcription }) {
        console.log(lastSentence);
        console.log("Finished On End");
        // `lastSentence` is the last sentence before the pause
        // `transcription` is the full array of sentences
      }
    }
  }
</script>
