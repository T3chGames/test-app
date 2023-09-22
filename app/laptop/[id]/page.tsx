const getData = async (id: number) => {
  let laptops = await fetch(`http://127.0.0.1:8000/api/laptops/${id}`);

  const data = await laptops.json();
  return {
    data: data,
  };
};

export default async function Page({ params }: { params: { id: number } }) {
  let data = await getData(params.id);
  console.log(data);
  return (
    <h1 className="text-3xl text-red-800">data: {JSON.stringify(data)}</h1>
  );
}
