import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();
  const redirect = useSearchParams().get("redirect");

  const { login, storeToken, storeIsAdmin } = AuthActions();

  const onSubmit = (data: FormData) => {
    login(data.username, data.password)
      .json((json) => {
        storeToken(json.access, "access");
        storeToken(json.refresh, "refresh");
        storeIsAdmin(json.access);
        
        const destination = redirect || "/dashboard"; // Fallback to dashboard if no redirect URL
        router.push(destination.toString()); // Ensure destination is a string
      })
      .catch((err) => {
        console.error(err);
        setError("root", { type: "manual", message: err.json.detail });
      });
  };

  return (
    <section>
      <div className="relative h-screen flex justify-center max-h-full overflow-hidden lg:px-0 md:px-12">
        <div className="relative z-10 flex flex-col flex-1 px-4 py-10 bg-white dark:bg-slate-800 lg:border-r lg:py-24 md:flex-none md:px-28 sm:justify-center">
          <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold tracking-tighter text-gray-900 dark:text-white">
                AttendanceTracker
              </h1>
            </div>
  
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="space-y-3">
                <div>
                  <label htmlFor="username" className="block mb-3 text-sm font-medium text-black dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    {...register("username", { required: true })}
                    className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                  />
                  {errors.username && (
                    <span className="text-xs text-red-600">Username is required</span>
                  )}
                </div>
                <div className="col-span-full">
                  <label className="block mb-3 text-sm font-medium text-black dark:text-white" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                    className="block w-full h-12 px-4 py-2 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
                  />
                  {errors.password && (
                    <span className="text-xs text-red-600">Password is required</span>
                  )}
                </div>
                <div className="col-span-full">
                  <button type="submit" className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium text-white duration-200 bg-gray-900 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Sign in
                  </button>
                </div>
                {errors.root && (
                  <span className="text-xs text-red-600">{errors.root.message}</span>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="hidden bg-white lg:block lg:flex-1 lg:relative sm:contents">
          <div className="absolute inset-0 object-cover w-full h-full bg-white flex justify-center items-center" >
            <img className="object-cover object-center w-full h-auto bg-gray-200" alt="aa" height="1866" width="1664" src="https://blog.cdn.cmarix.com/blog/wp-content/uploads/2022/05/Attendance-Management-System.png" alt="" width="1310" height="873" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;