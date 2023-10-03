"use client";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

export default function page() {
  const decodeLogin = async (bearerToken: string) => {
    const body = { bearerToken: bearerToken, provider: "google" };
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(body),
    };

    await fetch(`http://127.0.0.1:8000/api/decode`, requestOptions).then(
      (response) => {
        response.json().then((data) => {
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "/";
        });
      }
    );
  };

  return (
    <div className="container flex align-middle items-center">
      <div className="bg-background w-3/12 h-4/6 mt-24 shadow-xl text-center">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mt-12 text-shadow">Login</h1>
        </div>
        <div className="grid grid-col-3 align-">
          <div className="container flex align-middle items-center">
            <div className="bg-white w-3/6 h-20 mb-4 rounded-md shadow-2xl">
              <div className="container flex align-middel">
                <img src="" alt="" />
                <h1 className="text-black font-bold text-2xl text-center ">
                  Virtutec
                </h1>
              </div>
            </div>
          </div>
          <div className="container flex align-middle items-center">
            <div className="bg-white w-3/6 h-20 mb-4 rounded-md shadow-2xl">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  decodeLogin(credentialResponse.credential);
                }}
                onError={() => {
                  console.log("error");
                }}
                useOneTap
              >
                {" "}
              </GoogleLogin>
            </div>
          </div>
          <div className="container flex align-middle items-center">
            <div className="bg-white w-3/6 h-20 mb-4 rounded-md shadow-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
