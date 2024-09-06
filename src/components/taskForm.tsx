import { useEffect, useState } from "react";
import { CreateTask, UpdateTask } from "../types/tasks";
import { TaskStatus } from "../types/taskStatus";
import { toast } from "react-toastify";
import createTask from "../services/create";
import { getStatusFromString } from "../shared/getTaskStatusFromString";
import updateTask from "../services/update";
import { useParams } from "react-router-dom";
import formatDate from "../shared/dateHelper";
import { useFormik } from "formik";
import { createTaskSchema, updateTaskSchema } from "../shared/validationSchemas"; 

interface TaskFormProps {
  task?: UpdateTask;
}

const TaskForm = ({ task }: TaskFormProps) => {
  const { id } = useParams();
  const [inputKeywordValue, setInputKeywordValue] = useState<string>("");

  //Estabelece estado inicial do formulário, preenchendo para update e vazio para create
  //Seta a lógica do OnSubmit do formulário também distinguindo se é update ou create

  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      keywords: task?.keywords || [],
      status: getStatusFromString(task?.status) || TaskStatus.Pendente,
      creationDate: task?.creationDate || "",
      updatedDate: task?.updatedDate || "",
      id: task?.id || "",
    },
    validationSchema: task ? updateTaskSchema : createTaskSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        if (task) {
          await updateTask(id, values);
          toast.success("Tarefa atualizada com sucesso");
        } else {
          await createTask(values);
          toast.success("Tarefa criada com sucesso");
        }
      } catch (error: any) {
        toast.warning("Erro: " + error.message);
      }
    },
  });

  //Adição e remoção de palavras-chaves
  const handleAddKeyWord = (e: any) => {
    if (e.key === "Enter" && inputKeywordValue.trim()) {
      e.preventDefault();
      formik.setFieldValue("keywords", [...formik.values.keywords, inputKeywordValue.trim()]);
      setInputKeywordValue("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeyWords = formik.values.keywords.filter((_, i) => i !== index);
    formik.setFieldValue("keywords", newKeyWords);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
      <p className="text-lg font-bold text-custom-purple">{task ? "Atualizar Tarefa" : "Criar Tarefa"}</p>

      <div>
        <label htmlFor="title" className="block text-custom-blue font-semibold mb-2">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          className="w-full px-4 py-1 border border-custom-purple bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-custom-blue"
          placeholder="Título da tarefa"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title ? (
          <p className="text-red-500">{formik.errors.title}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="keywords" className="block text-custom-blue font-semibold mb-2">Palavras-chave</label>
        <div className="w-full px-4 py-1 border border-custom-purple bg-transparent rounded flex flex-wrap items-center gap-2">
          {formik.values.keywords.map((keyword, index) => (
            <div key={index} className="bg-custom-purple text-white px-2 py-1 rounded-full flex items-center space-x-2">
              <span>{keyword}</span>
              <button type="button" onClick={() => handleRemoveKeyword(index)} className="text-white hover:text-red-500">&times;</button>
            </div>
          ))}
          <input
            type="text"
            value={inputKeywordValue}
            onChange={(e) => setInputKeywordValue(e.target.value)}
            onKeyDown={handleAddKeyWord}
            className="flex-grow bg-transparent outline-none"
            placeholder="Digite e pressione Enter"
          />
          
        </div>
        {formik.touched.keywords && formik.errors.keywords ? (
            <p className="text-red-500">{formik.errors.keywords}</p>
          ) : null}
      </div>

      <div>
        <label htmlFor="status" className="block text-custom-blue font-semibold mb-2">Status</label>
        <select
          id="status"
          name="status"
          value={formik.values.status}
          className="w-full px-4 py-1 border border-custom-purple bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-custom-blue"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value={TaskStatus.Pendente}>Pendente</option>
          <option value={TaskStatus["Em Progresso"]}>Em Progresso</option>
          <option value={TaskStatus.Concluída}>Concluída</option>
        </select>
        {formik.touched.status && formik.errors.status ? (
          <p className="text-red-500">{formik.errors.status}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="creationDate" className="block text-custom-blue font-semibold mb-2">Data Criação</label>
        <input
          type="date"
          id="creationDate"
          name="creationDate"
          value={formatDate(formik.values.creationDate)}
          className="w-full px-4 py-1 border border-custom-purple bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-custom-blue"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.creationDate && formik.errors.creationDate ? (
          <p className="text-red-500">{formik.errors.creationDate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="updatedDate" className="block text-custom-blue font-semibold mb-2">Data Atualização</label>
        <input
          type="date"
          id="updatedDate"
          name="updatedDate"
          value={formatDate(formik.values.updatedDate)}
          className="w-full px-4 py-1 border border-custom-purple bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-custom-blue"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.updatedDate && formik.errors.updatedDate ? (
          <p className="text-red-500">{formik.errors.updatedDate}</p>
        ) : null}
      </div>

      <div className="text-center">
        <button type="submit" className="w-1/2 p-1 border-2 self-center border-custom-purple text-custom-purple font-bold rounded-full hover:bg-custom-purple hover:text-white transition duration-300">
          {task ? "Atualizar Tarefa" : "Criar Tarefa"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
