import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

import RingLoading from './Loading';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [Loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    // console.log({...data})
    const userData = { user: { ...data } };
    axios
      .post('https://todoo.5xcamp.us/users', userData)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: `帳號：${res.data.email} ${res.data.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(false);
      })
      .catch((err) => {
        let errorDataString = '';
        // console.log(err.response)
        const errorData = err.response.data.error;
        errorData.forEach((item, i) => {
          errorDataString += `${item} !\n`;
        });
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: err.response.data.message,
          html: '<pre>' + errorDataString + '</pre>',
        });
      });
  };

  return (
    <div id="signUpPage" className="bg-yellow">
      {Loading ? <RingLoading /> : null}
      <div className="container signUpPage vhContainer">
        <div className="side">
          <a href="#/SignUp">
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
        <div>
          <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="formControls_txt">註冊帳號</h2>
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
                required: { value: true, message: '此欄位必填' },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, // eslint-disable-line
                  message: '不符合 Email 規則',
                },
              })}
            />
            <span>{errors.email?.message}</span>
            <label className="formControls_label" htmlFor="nickname">
              您的暱稱
            </label>
            <input
              className="formControls_input"
              type="text"
              name="nickname"
              id="nickname"
              placeholder="請輸入您的暱稱"
              {...register('nickname', {
                required: { value: true, message: '此欄位必填' },
              })}
            />
            <span>{errors.nickname?.message}</span>
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
                required: { value: true, message: '此欄位必填' },
                minLength: { value: 6, message: '密碼至少為6碼' },
              })}
            />
            <span>{errors.password?.message}</span>
            <label className="formControls_label" htmlFor="passwordCheck">
              再次輸入密碼
            </label>
            <input
              className="formControls_input"
              type="password"
              name="passwordCheck"
              id="passwordCheck"
              placeholder="請再次輸入密碼"
              {...register('passwordCheck', {
                required: { value: true, message: '此欄位必填' },
                validate: (value) =>
                  value === watch('password', '') || '密碼不一致',
              })}
            />
            <span>{errors.passwordCheck?.message}</span>
            <input
              className="formControls_btnSubmit"
              type="submit"
              disabled={Object.keys(errors).length > 0}
              value="註冊帳號"
            />
            <Link to="/" className="formControls_btnLink">
              登入 TodoList
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
