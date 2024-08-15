import { createStore } from 'vuex'; // Vuex 4.x를 사용하는 경우
import ui from './ui'; // ui 모듈

// Vuex 스토어를 생성합니다
const store = createStore({
    modules: { // Vuex 3.x의 'module' 대신 'modules'를 사용합니다
        ui,
    },
});

export default store;