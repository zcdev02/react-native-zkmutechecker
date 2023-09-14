//Колбэк, возвращающий статус когда включился режим не беспокоить или бесшумный
export type eventCallback = (newVal: boolean) => void; //
//Функция подписки на ивент с отслеживанием статуса переключения режимов
export type addEventListenerType = (callback: (val: boolean) => void) => void;
export type getStatus = () => Promise<boolean>; // Возвращает текущий статус беззвучного режима

export type zkMutecheckerType = {
  addMuteModeChangeListener: addEventListenerType;
  getLastStatus: getStatus;
};
