import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// stateの型
interface TaskState {
  // taskが何個あるのか管理
  idCount: number;
  // storeに保存するtask一覧
  tasks: { id: string; title: string; completed: boolean }[];
  // taskのtitleを編集する際にどのtaskが選択されているか
  selectedTask: { id: string; title: string; completed: boolean };
  // Modalを開くか閉じるかのフラグ
  isModalOpen: boolean;
}

// stateの初期値
const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: "", title: "", completed: false },
  isModalOpen: false,
};

/* ========================================================
Taskの全件取得
==========================================================*/
export const fetchTasks = createAsyncThunk("task/getAllTasks", async () => {
  const citiesCol = collection(db, "tasks");
  const citySnapshot = await getDocs(citiesCol);

  const cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(cityList);

  const allTasks = citySnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));

  const taskNumber = allTasks.length;
  const passData = { allTasks, taskNumber };

  return passData;
});

export const taskSlice = createSlice({
  // このsliceの名前。actionTypeを生成するときにprefixとなる。
  name: "task",
  // このsliceで用いるinitialStateの値
  initialState,
  // reducersの中身を記述
  reducers: {
    // taskの作成
    createTask: (state, action) => {
      /*
      state.idCount++;
      const newTask = {
        id: state.idCount,
        title: action.payload,
        completed: false,
      };
      state.tasks = [newTask, ...state.tasks];
      */
    },
    // taskの消去
    deleteTask: (state, action) => {
      /*  state.idCount--;
      state.tasks = state.tasks.filter((item) => {
        return item.id !== action.payload;
      });
      console.log(action.payload); */
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    editTask: (state, action) => {
      /*
      const task = state.tasks.find((t) => t.id === action.payload.id);

      if (task) {
        task.title = action.payload.title;
      }*/
    },
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload?.allTasks;
      state.idCount = action.payload?.taskNumber;
    });
  },
});

export const { createTask, deleteTask, handleModalOpen, selectTask, editTask } =
  taskSlice.actions;

// コンポーネント側からuseSlectorを用いてselectTaskを指定することで
// stateの値をコンポーネントに渡すことが可能
export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectSelectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export default taskSlice.reducer;
