// Table.js
import React from "react";
import { useTable } from "react-table";


function Table({ data }) {
    const columns = React.useMemo(
        () => [
            {
                Header: "Top Favorites Tracks",
                columns: [
                    {
                        Header: 'Image',
                        accessor: 'album.images[0].url',
                        Cell: (props) => <img height={120} src={(props.value)} />,
                    },
                    {
                        // grupo de colunas
                        Header: 'Track',
                        accessor: 'name',
                    },
                    {
                        Header: 'Artist',
                        accessor: 'artists[0].name',
                    },

                ]
            }
        ],
        []
    )
    const {
        getTableProps, // propriedades da tabela
        getTableBodyProps, // propriedades do corpo da tabela
        headerGroups, // os valores de agrupamento de tabela, caso sua tabela use
        rows, // linhas da tabela baseado nos dados e colunas
        prepareRow // Prepara a linha (Essa função deve ser chamada para cada linha)
    } = useTable({
        columns,
        data
    });


    return (
        <table {...getTableProps()}>
            <thead className="table-header">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="table-body" {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
export default Table;