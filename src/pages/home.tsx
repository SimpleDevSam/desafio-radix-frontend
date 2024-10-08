import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TaskStatus } from '../types/taskStatus';
import { UpdateTask } from '../types/tasks';
import { toast } from 'react-toastify';
import NotFoundWarning from '../components/notFoundWarning';
import LayoutContainer from '../components/layoutContainer';
import getTasks from '../services/tasks/getTasks';
import MainTitle from '../components/MainTitle';





const Home = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<UpdateTask[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                toast.error("Falha ao buscar tarefas")
            } finally {
                setLoading(false)
              }
        };
        fetchTasks();
    }, []);

    const handleNavigateToTasks = () => {
        navigate('tasks');
    }

    const handleNavigateToCreateTask = () => {
        const nonExistingId = "0";
        const path = '/tasks/createOrUpdate/' + nonExistingId
        navigate(path);
    }

    const isTasksEmpty = tasks.length === 0

    const pendingTasksCount = tasks.filter(task => Number(task.status) === TaskStatus.Pendente).length;
    const inProgressTasksCount = tasks.filter(task => Number(task.status) === TaskStatus['Em Progresso']).length;
    const concludedTasksCount = tasks.filter(task => Number(task.status) === TaskStatus.Concluída).length;

    return (
        <LayoutContainer>
            <div className="mb-8  ">
                <MainTitle
                message='Dashboard'/>
            </div>
            <div>
                {loading ?  <div className="text-center text-custom-purple">Carregando tarefas...</div>
                 : 
                isTasksEmpty ?
                    (
                        <div className='flex flex-col justify-center items-center w-1/2 gap-4 mx-auto'>
                            <NotFoundWarning message="Não foram encontradas tarefas" />
                            <button
                                onClick={handleNavigateToCreateTask}
                                className="w-1/2 p-4 my-24 border-2 border-custom-purple text-custom-purple font-bold rounded-full hover:bg-custom-purple hover:text-white transition duration-300"
                            >
                                Adicionar 1ª tarefa
                            </button>
                        </div>
                    )
                    :
                    (<div className='justify-center flex flex-col'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-white border border-custom-red rounded-lg shadow">
                                <p className="text-5xl font-bold text-custom-red">{pendingTasksCount}</p>
                                <p className="text-xl text-custom-red">Tarefas Pendentes</p>
                            </div>
                            <div className="p-6 bg-white border border-gray-500 rounded-lg shadow">
                                <p className="text-5xl font-bold text-gray-500">{inProgressTasksCount}</p>
                                <p className="text-xl text-gray-500">Tarefas em Progresso</p>
                            </div>
                            <div className="p-6 bg-white border border-custom-green rounded-lg shadow">
                                <p className="text-5xl font-bold text-custom-green">{concludedTasksCount}</p>
                                <p className="text-xl text-custom-green">Tarefas Concluídas</p>
                            </div>
                        </div>
                        <button onClick={handleNavigateToTasks} className="w-1/2  p-4 my-24 border-2 self-center border-custom-purple text-custom-purple font-bold rounded-full hover:bg-custom-purple hover:text-white transition duration-300">
                            Ver todas as tarefas
                        </button>
                    </div>

                    )}
            </div>
        </LayoutContainer>
    );
};

export default Home;
