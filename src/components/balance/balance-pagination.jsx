import { useState } from "react";
import { getUserToken } from "../../services/token/tokenService";
import { filterByType } from "../../services/myfinances-api/transacciones";

export const BalancePagination = ({
    setTransactions,
    auth,
    type,
    setLoading,
    metadata,
    setMetadata
}) => {
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    let hasNextPage = metadata?.hasNextPage ?? true;

    const nextPage = (page) => {
        if (hasNextPage) {
            setCurrentPage(page + 1);
            handleChangePage(page + 1);
        }
    };
    const prevPage = (page) => {
        if (currentPage !== 1) {
            setCurrentPage(page - 1);
            handleChangePage(page - 1);
        }
    };
    const handleChangePage = async (page) => {
        setLoading(true);
        const user = getUserToken();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };
        const fetchTransactions = async () => {
            const payload = {
                userId: user.id,
                tipo: type
            };
            try {
                const { data: response } = await filterByType(payload, page, 5, config);
                setLoading(false);
                setTransactions(response.data);
                if (setMetadata)
                    setMetadata(response.meta);
                if (response.meta?.hasNextPage)
                    hasNextPage = response.meta?.hasNextPage;
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchTransactions();
    };
    return (
        <div className="bg-inherit px-4 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                <div>
                    <nav className="inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                            disabled={currentPage === 1}
                            style={currentPage === 1 ? { cursor: "not-allowed" } : { cursor: "pointer" }}
                            className="relative inline-flex items-center rounded-l-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => prevPage(currentPage)}
                        >
                            <i className="fa-solid fa-arrow-left text-sm"
                                style={currentPage === 1 ? { cursor: "not-allowed" } : { cursor: "pointer" }}></i>
                            <span className="m-1 text-sm">Anterior</span>
                        </button>
                        <button
                            disabled={!hasNextPage || (currentPage === 1 && !hasNextPage)}
                            style={!hasNextPage || (currentPage === 1 && !hasNextPage) ? { cursor: "not-allowed" } : { cursor: "pointer" }}
                            className="inline-flex items-center rounded-r-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => nextPage(currentPage)}
                        >
                            <span className="m-1 text-sm">Siguiente</span>
                            <i className="fa-solid fa-arrow-right text-sm"
                                style={!hasNextPage || (currentPage === 1 && !hasNextPage) ? { cursor: "not-allowed" } : { cursor: "pointer" }}></i>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};