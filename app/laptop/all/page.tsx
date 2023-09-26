import { json } from "stream/consumers";

const getData = async () => {
  let laptops = await fetch("http://127.0.0.1:8000/api/laptops");

  const data = await laptops.json();
  return {
    data: data,
  };
};

export default async function Page() {
  return (
    <div>
      <div className="container-img w-full h-screen min-w-full">test</div>
    </div>
  );

  // let data = await getData();
  // console.log(data);
  // return <h1 className="font-xxl">data: {JSON.stringify(data)}</h1>;
}
