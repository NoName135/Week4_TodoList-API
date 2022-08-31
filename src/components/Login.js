import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

import { useAuth } from './Context';
import RingLoading from './Loading';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('localTodo') !== null) {
      setToken(localStorage.getItem('localTodo'));
      navigate('todoList', {
        replace: false,
        state: {
          nickName: JSON.parse(localStorage.getItem('localUserData')).nickname,
        },
      });
    }
    // eslint-disable-next-line
  }, [])

  const onSubmit = (data) => {
    setLoading(true);
    // console.log({...data})
    const userData = { user: { ...data } };
    axios
      .post('https://todoo.5xcamp.us/users/sign_in', userData)
      .then((res) => {
        setToken(res.headers.authorization);
        localStorage.setItem('localTodo', res.headers.authorization);
        localStorage.setItem('localUserData', JSON.stringify(res.data));
        navigate('todoList', {
          replace: true,
          state: { nickName: res.data.nickname },
        });
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err.response);
        Swal.fire({
          icon: 'error',
          title: err.response.data.message,
          html: `<pre>帳號或密碼錯誤 !\n請重新輸入</pre>`,
        });
        setLoading(false);
      });
  };

  return (
    <div id="loginPage" className="bg-yellow">
      {Loading ? <RingLoading /> : null}
      <div className="container loginPage vhContainer">
        <div className="side">
          <a href="#/">
            <img
              className="logoImg"
              src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
              alt=""
            />
          </a>
          <img
            className="d-m-n"
            src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
            alt="workImg"
          />
        </div>
        <div className="formControls_wrap">
          <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="formControls_txt">最實用的線上待辦事項服務</h2>
            <label className="formControls_label" htmlFor="account">
              帳號
            </label>
            <input
              className="formControls_input"
              type="text"
              name="email"
              id="account"
              placeholder="請輸入 Email"
              {...register('email', {
                required: { value: true, message: '請輸入帳號' },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, // eslint-disable-line
                  message: '不符合 Email 規則',
                },
              })}
            />
            <span>{errors.email?.message}</span>

            <label className="formControls_label" htmlFor="password">
              密碼
            </label>
            <input
              className="formControls_input"
              type="password"
              name="password"
              id="password"
              placeholder="請輸入密碼"
              {...register('password', {
                required: { value: true, message: '請輸入密碼' },
              })}
            />
            <span>{errors.password?.message}</span>

            <input
              className="formControls_btnSubmit"
              type="submit"
              disabled={Object.keys(errors).length > 0}
              value="登入"
            />
            <Link to="/signUp" className="formControls_btnLink">
              註冊帳號
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
