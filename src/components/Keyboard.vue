<template>
<Teleport to="body">
  <div 
    ref="root"
    class="keyboard" 
    :class="{'keyboard_hidden': isHidden}"
    >
    <div class="keyboard_keys">
      <template 
        v-for="key in keyLayout" 
        :key="key"
        >
        <button 
          type="button"
          class="keyboard_key"
          :class="{
            'keyboard_key_wide': key === 'backspace'|| key === 'enter',
            'keyboard_key_wide keyboard_key_activatable': key === 'caps',
            'keyboard_key_extra-wide': key === 'space',
            'keyboard_key_wide keyboard_key_dark': key === 'done',
            'keyboard_key_active': key === 'caps' && isCapsLockOn
          }"
          @click="buttonClick(key)"
          >
          <i v-if="key === 'backspace'" class="material-icons">
            backspace
          </i>
          <i v-else-if="key === 'caps'" class="material-icons">
            keyboard_capslock
          </i>
          <i v-else-if="key === 'enter'" class="material-icons">
            keyboard_return
          </i>
          <i v-else-if="key === 'space'" class="material-icons">
            space_bar
          </i>
          <i v-else-if="key === 'done'" class="material-icons">
            check_circle
          </i>
          <template v-else>
            {{ key }}
          </template>
        </button>
        <br v-if="insertLineBreak(key)"/>
      </template>
    </div>
  </div>
</Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => ('')
  },
});
const emit = defineEmits(['update:modelValue', 'oninput', 'onclose']);

const value = ref(props.modelValue);
const isHidden = ref(true);
const isCapsLockOn = ref(false);
const root = ref(null);

const keyLayout = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
  "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
  "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
  "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
  "space"
];
const insertLineBreak = (key) => {
  return ["backspace", "p", "enter", "?"].indexOf(key) !== -1
};

const _toggleCapsLock = () => {
  isCapsLockOn.value = !isCapsLockOn.value;
  const allKeys = root.value.querySelectorAll('.keyboard_key');

  for (const key of allKeys) {
    if (key.childElementCount === 0) {
      key.textContent = isCapsLockOn.value ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
    }
  }
}

const close = () => {
  isHidden.value = true;
}

document.querySelectorAll(".use-keyboard-input").forEach(element => {
  element.addEventListener("focus", () => {
    isHidden.value = false;
  });
  element.addEventListener("click", () => {
    isHidden.value = false;
  });
});

const buttonClick = (key) => {
  switch (key) {
    case "backspace":
      value.value = value.value.substring(0, value.value.length - 1);
      emit('oninput');
      
      break;

    case "caps":
      _toggleCapsLock();

      break;

    case "enter":
      value.value += "\n";
      emit('oninput');    

      break;

    case "space":
      value.value += " ";
      emit('oninput');

      break;

    case "done":
      close();
      emit('onclose');

      break;

    default:
      value.value += isCapsLockOn.value ? key.toUpperCase() : key.toLowerCase();
      emit('oninput');

      break;
  }
}

watch(value, (newValue) => {
  emit('update:modelValue', newValue);
});

function clickAway($event) {
  if ($event && $event.target && !root.value.contains($event.target) 
    && !$event.target.classList.contains('use-keyboard-input')) {
    close();
  }
}

function handleEscape(e) {
  if (!isHidden.value && e.keyCode === 27) {
    close();
  }
}

watch(isHidden, async (newIsHidden) => {
  if (typeof document === "object") {
    await nextTick();

    newIsHidden ? document.body.removeEventListener('click', clickAway) : document.body.addEventListener('click', clickAway);
    newIsHidden ? document.removeEventListener('keydown', handleEscape) : document.addEventListener('keydown', handleEscape)
  }
});
</script>

<style>
.keyboard {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 0;
  background: #9b59b6;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  user-select: none;
  transition: bottom 0.4s;
}

.keyboard_hidden {
  bottom: -100%;
}

.keyboard_keys {
  text-align: center;
}

.keyboard_key {
  height: 45px;
  width: 6%;
  max-width: 90px;
  margin: 3px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1.05rem;
  outline: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: top;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.keyboard_key:active {
  background: rgba(255, 255, 255, 0.12);
}

.keyboard_key_wide {
  width: 12%;
}

.keyboard_key_extra-wide {
  width: 36%;
  max-width: 500px;
}

.keyboard_key_activatable::after {
  content: '';
  top: 10px;
  right: 10px;
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
}

.keyboard_key_active::after {
  background: #08ff00;
}

.keyboard_key_dark {
  background: rgba(0, 0, 0, 0.25);
}

</style>
