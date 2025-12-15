import { onMounted, onUnmounted, nextTick, type Ref } from 'vue';

export function useTextareaAutosize(textarea: Ref<HTMLTextAreaElement | null>, input: Ref<string>) {
    const resize = () => {
        const el = textarea.value;
        if (!el) return;

        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    onMounted(() => {
        if (textarea.value) {
            textarea.value.addEventListener('input', resize);
            // Initial resize
            nextTick(resize);
        }
    });

    onUnmounted(() => {
        if (textarea.value) {
            textarea.value.removeEventListener('input', resize);
        }
    });

    // Watch for external value changes (programmatic updates)
    watch(input, () => {
        nextTick(resize);
    });

    return { resize };
}
