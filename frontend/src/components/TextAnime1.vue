<template>
    <div class="TextAnime1">
        <span v-for="(t, index) in text" :key="index" v-text="t" class="item delay-anime"></span>
    </div>
</template>

<script>
export default {
    data() {
        return {
        text: "DAZZLE"
        }
    }
}
</script>

<style lang="stylus" scoped>
@keyframes text-in {
    0% {
        transform: translate(0, -20px);
        opacity: 0;
    }
}

.item {
    display: inline-block;
    min-width: 0.3em;
    font-size: 4rem;
    animation: text-in 0.8s cubic-bezier(0.22, 0.15, 0.25, 1.43) 0s backwards;
}

for co in 0 .. 12 {
    .delay-anime:nth-child({co + 1}) {
      animation-delay: co * 100ms + 200ms;
    }
}
</style>