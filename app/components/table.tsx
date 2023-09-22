"use client";

export default function (params: any) {
  console.log(params.params);
  return (
    <table className="table-auto">
      <thead>
        <tr>
          {params.params.thead.map((item: string, id: any) => {
            {
              return <th key={id}>{item}</th>;
            }
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          {params.params.tbody.map((item: string, id: any) => {
            {
              return <td key={id}>{item}</td>;
            }
          })}
        </tr>
      </tbody>
    </table>
  );
}
