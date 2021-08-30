import React from "react";
import TextField from "@material-ui/core/TextField";
import styles from "./TaskForm.module.scss";

const TaskForm: React.FC = () => {
  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          label="New Task"
          variant="outlined"
          className={styles.text_field}
        />
      </form>
    </div>
  );
};

export default TaskForm;
