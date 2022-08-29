import { useState,useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlus, faPencil } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from './Context';
import RingLoading from './Loading';

const TodoList = () =>{
  const { token, setToken } = useAuth();
  const { nickName } = useLocation().state;
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const [character, setCharacter] = useState('');

  // { id: 1660482483200, content: "睜開眼睛", completed_at: true },
  // { id: 1660482483201, content: "離開枕頭", completed_at: null }
  const [todo, setTodo] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [changeTodo, setChangeTodo] = useState(false);

  const getTodo = () => {
    setLoading(true);
    axios
      .get('https://todoo.5xcamp.us/todos', {
        headers: { Authorization: token },
      })
      .then((res) => {
        setTodo(res.data.todos);
        setLoading(false);
        if(firstRender){
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 1300,
            timerProgressBar: true,
            title: '登入成功',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          setFirstRender(false);
        }
      })
      .catch((err) => {
        console.log(err.response);
        if(!firstRender){
          Swal.fire({
            icon: 'error',
            title: '獲取資料失敗!',
          });
        }
        setLoading(false);
        localStorage.clear();
        setToken(null);
        navigate('/');
      });
  }

  useEffect(() => {
    getTodo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setChangeTodo(false)
    getTodo();
    // eslint-disable-next-line
  }, [changeTodo]);

  const [selState, setSelState] = useState('全部');
  const [state, setState] = useState([
    { title: '全部', active: 'active' },
    { title: '待完成', active: '' },
    { title: '已完成', active: '' },
  ]);

  const clearLocalStorage = (e) => {
    e.preventDefault();
    localStorage.clear();
  }

  const addTodo = (e) => {
    e.preventDefault();
    if (character === '') {
      return;
    } else {
      setLoading(true);
      axios
        .post(
          'https://todoo.5xcamp.us/todos',
          { todo: { content: character } },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          setChangeTodo(true);
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: '新增資料失敗!',
          });
        });
        setCharacter('');
    }
  };

  const clearComplete = (e) => {
    e.preventDefault();
      Swal.fire({
        title: '確定要刪除已完成待辦?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '確定刪除!',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          todo.forEach((data) => {
            if (data.completed_at !== null) {
              setLoading(true);
              axios
                .delete(`https://todoo.5xcamp.us/todos/${data.id}`, {
                  headers: { Authorization: token },
                })
                .then((res) => {
                  setChangeTodo(true);
                  Swal.fire('刪除成功!', '已刪除全部已完成待辦', 'success');
                })
                .catch((err) => {
                  console.log(err.response);
                  setLoading(false);
                  Swal.fire({
                    icon: 'error',
                    title: '刪除資料失敗!',
                  });
                });
            }
          });
        }
      });
  };

  function TitleState(props) {
    const { title, active } = props.item;
    return (
      <li>
        <a
          href="#/todoList"
          className={active}
          onClick={(e) => {
            e.preventDefault();
            setSelState(title);
            setState(
              state.map((data) =>
                data.title === title
                  ? { ...data, active: 'active' }
                  : { ...data, active: '' }
              )
            );
          }}
        >
          {title}
        </a>
      </li>
    );
  }

  function TodoList(props) {
    const { id, content, completed_at } = props.item;
    return (
      <li>
        <a
          className="edit_todo"
          href="#/todoList"
          onClick={(e) => {
            e.preventDefault();
            Swal.fire({
              title: '請輸入修改內容',
              backdrop: true,
              allowOutsideClick: false,
              closeOnClickOutside: false,
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off',
              },
              customClass: 'swal-wide',

              showCancelButton: true,
              confirmButtonText: '修改待辦',
              showLoaderOnConfirm: true,
              // cancelButtonText: '取消',
              preConfirm: (content) => {
                axios
                  .put(
                    `https://todoo.5xcamp.us/todos/${id}`,
                    { todo: { content: content } },
                    {
                      headers: {
                        Authorization: token,
                      },
                    }
                  )
                  .then((res) => {
                    getTodo();
                  })
                  .catch((err) => {
                    console.log(err.response);
                    Swal.showValidationMessage('修改資料失敗');
                  });
              },
              // allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
                console.log(result);
                Swal.fire({
                  icon: 'success',
                  title: `修改資料成功`,
                  text: `待辦更新：${result.value}`,
                });
              }
            });
          }}
        >
          <FontAwesomeIcon className="fa-2x" icon={faPencil} />
        </a>
        <label className="todoList_label">
          <input
            className="todoList_input"
            type="checkbox"
            checked={completed_at ? 'checked' : ''}
            onChange={(e) => {
              e.preventDefault();
              setLoading(true);
              axios
                .patch(`https://todoo.5xcamp.us/todos/${id}/toggle`, id, {
                  headers: { Authorization: token },
                })
                .then((res) => {
                  setChangeTodo(true);
                })
                .catch((err) => {
                  console.log(err.response);
                  setLoading(false);
                  Swal.fire({
                    icon: 'error',
                    title: '變更資料失敗!',
                  });
                });
            }}
          />
          <span>{content}</span>
        </label>
        <a
          className="delete_todo"
          href="#/todoList"
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            axios
              .delete(`https://todoo.5xcamp.us/todos/${id}`, {
                headers: { Authorization: token },
              })
              .then((res) => {
                setChangeTodo(true);
              })
              .catch((err) => {
                console.log(err.response);
                setLoading(false);
                Swal.fire({
                  icon: 'error',
                  title: '刪除資料失敗!',
                });
              });
          }}
        >
          <FontAwesomeIcon className="fa-2x" icon={faTrashCan} />
        </a>
      </li>
    );
  }

  return (
    <div id="todoListPage" className="bg-half">
      {Loading ? <RingLoading /> : null}
      <nav>
        <h1>
          <a href="#/todoList">ONLINE TODO LIST</a>
        </h1>
        <ul>
          <li className="todo_sm">
            <a href="#/todoList">
              <span>{nickName}的待辦</span>
            </a>
          </li>
          <li onClick={clearLocalStorage}>
            <Link to="/" replace="true">
              登出
            </Link>
          </li>
        </ul>
      </nav>
      <div className="container todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input
              type="text"
              placeholder="請輸入待辦事項"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') addTodo(e);
              }}
            />
            <a href="#/todoList" onClick={addTodo}>
              <FontAwesomeIcon icon={faPlus} />
            </a>
          </div>
          <div className="todoList_list">
            <ul className="todoList_tab">
              {state.map((item, i) => {
                return <TitleState key={i} item={item} />;
              })}
            </ul>
            <div className="todoList_items">
              <ul className="todoList_item">
                {todo.length === 0 ? (
                  <div>
                    <p className="todo-none">目前尚無待辦事項</p>
                  </div>
                ) : (
                  todo
                    .filter((item) => {
                      if (selState === '待完成') {
                        return item.completed_at === null;
                      } else if (selState === '已完成') {
                        return item.completed_at !== null;
                      } else {
                        return true;
                      }
                    })
                    .map((item, i) => {
                      return <TodoList key={i} item={item} />;
                    })
                )}
              </ul>
              <div className="todoList_statistics">
                <p>
                  {' '}
                  {
                    todo.filter((data) => data.completed_at === null).length
                  }{' '}
                  個待完成項目
                </p>
                <a href="#/todoList" onClick={clearComplete}>
                  清除已完成項目
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;