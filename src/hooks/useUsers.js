import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/ApiClient";
import { listUsers } from "../services/UserService";

const LIMIT = 20;

export const useUsers = (search) => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let ignore = false;
        listUsers({ search, limit: LIMIT })
            .then(({ data, pagination }) => {
                if (ignore) return;
                setUsers(data);
                setTotal(pagination.total);
                setError(null);
            })
            .catch((err) => {
                if (!ignore) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [search, version]);

    const reload = useCallback(() => setVersion((current) => current + 1), []);

    return { users, total, loading, error, reload };
};
