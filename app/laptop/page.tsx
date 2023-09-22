import Table from "../components/table";

export default function Page() {
  const data = {
    thead: ["name", "size", "price"],
    tbody: ["abc", "12", "1230", "abde"],
  };
  return <Table params={data} />;
}
