import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import { Button, Input } from "antd";
import { LoginIcon, PasswordIcon } from "../../assets/icons";
import { useFormik } from "formik";
import { LoginSchema } from "../../validation/index";
import { useState } from "react";
import LogoImage from "../../assets/images";

const login = () => {
  const [isPenning, setPenning] = useState(false);
  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: { username: "", password: "" },
      validationSchema: LoginSchema,
      onSubmit: (data) => {
        setPenning(true);
        console.log(data);
      },
    });

  return (
    <div className="containers relative !pt-[90px] h-[100vh]">
      <img
        className="logo-icon mb-[32px]"
        src={LogoImage}
        alt="Logo"
        width={40}
        height={40}
      />
      <Heading tag="h1" classList="!mb-[12px]">
        Dasturga kirish
      </Heading>
      <Text>Iltimos, tizimga kirish uchun login va parolingizni kiriting.</Text>
      <form onSubmit={handleSubmit} className="mt-[38px]" autoComplete="off">
        <label>
          <Input
            className={`${
              errors.username && touched.username
                ? "!border-red-500 !text-red-500"
                : ""
            }`}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            prefix={<LoginIcon />}
            allowClear
            name="username"
            type="text"
            size="large"
            placeholder="Login"
          />
          {errors.username && touched.username && (
            <span className="text-[13px] text-red-500">{errors.username}</span>
          )}
        </label>
        <label>
          <Input.Password
            className={`${
              errors.password && touched.password
                ? "!border-red-500 !text-red-500"
                : ""
            } mt-[24px]`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            prefix={<PasswordIcon />}
            allowClear
            name="password"
            type="password"
            size="large"
            placeholder="Parol"
          />
          {errors.password && touched.password && (
            <span className="text-[13px] text-red-500">{errors.username}</span>
          )}
        </label>
        <Link
          className="text-[13px] mb-[46px] text-[#3478F7] border-b-[1px] border-[#3478F7] w-[130px] ml-auto block text-end mt-[10px]"
          to={"#"}
        >
          Parolni unutdingizmi?
        </Link>
        <Button
          loading={isPenning}
          htmlType="submit"
          className={`w-full !h-[45px] !text-[18px] !font-medium" size="large ${
            isPenning ? "cursor-not-allowed" : ""
          }`}
          type="primary"
        >
          Kirish
        </Button>
      </form>
      <Text classList="absolute bottom-0 !font-normal !pb-[10px]">
        Hisobingiz yo'q bo'lsa, tizimga kirish huquqini olish uchun{" "}
        <span className="text-[#3478F7]">do'kon administratori</span> bilan
        bog'laning.
      </Text>
    </div>
  );
};

export default login;
