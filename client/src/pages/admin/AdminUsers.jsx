import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminUserService } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getUsers({ page, limit: 20, search });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div data-icod-id="src_pages_admin_adminusers_jsx_a79f">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_adminusers_jsx_9dfd">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_adminusers_jsx_8d74">Users <span
          className="text-gray-400 text-lg font-normal"
          data-icod-id="src_pages_admin_adminusers_jsx_8d43">({total})</span></h1>
      </div>
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-5 max-w-md"
        data-icod-id="src_pages_admin_adminusers_jsx_01d0">
        <div
          className="relative flex-1"
          data-icod-id="src_pages_admin_adminusers_jsx_925d">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            data-icod-id="src_pages_admin_adminusers_jsx_027b" />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
          data-icod-id="src_pages_admin_adminusers_jsx_2c2d">
          Search
        </button>
      </form>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        data-icod-id="src_pages_admin_adminusers_jsx_7652">
        {loading ? (
          <div
            className="p-8 text-center"
            data-icod-id="src_pages_admin_adminusers_jsx_0715">
            <div
              className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
              data-icod-id="src_pages_admin_adminusers_jsx_bbcf" />
          </div>
        ) : (
          <>
            <table className="w-full" data-icod-id="src_pages_admin_adminusers_jsx_f328">
              <thead data-icod-id="src_pages_admin_adminusers_jsx_3a74">
                <tr
                  className="text-xs text-gray-500 border-b border-gray-100"
                  data-icod-id="src_pages_admin_adminusers_jsx_228e">
                  <th
                    className="text-left px-5 py-3 font-semibold"
                    data-icod-id="src_pages_admin_adminusers_jsx_cf39">User</th>
                  <th
                    className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                    data-icod-id="src_pages_admin_adminusers_jsx_4d3b">Phone</th>
                  <th
                    className="text-left px-5 py-3 font-semibold"
                    data-icod-id="src_pages_admin_adminusers_jsx_cd4a">Orders</th>
                  <th
                    className="text-left px-5 py-3 font-semibold hidden md:table-cell"
                    data-icod-id="src_pages_admin_adminusers_jsx_420b">Joined</th>
                </tr>
              </thead>
              <tbody data-icod-id="src_pages_admin_adminusers_jsx_6531">
                {users.length === 0 ? (
                  <tr data-icod-id="src_pages_admin_adminusers_jsx_1bb5"><td
                    colSpan={4}
                    className="text-center text-gray-400 py-8"
                    data-icod-id="src_pages_admin_adminusers_jsx_2f21">No users found</td></tr>
                ) : users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                    data-icod-id={`src_pages_admin_adminusers_jsx_2750_${user._id}`}>
                    <td
                      className="px-5 py-3"
                      data-icod-id={`src_pages_admin_adminusers_jsx_ae47_${user._id}`}>
                      <div
                        className="flex items-center gap-3"
                        data-icod-id={`src_pages_admin_adminusers_jsx_574b_${user._id}`}>
                        <div
                          className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0"
                          data-icod-id={`src_pages_admin_adminusers_jsx_cdd6_${user._id}`}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div data-icod-id={`src_pages_admin_adminusers_jsx_3012_${user._id}`}>
                          <p
                            className="font-medium text-gray-800 text-sm"
                            data-icod-id={`src_pages_admin_adminusers_jsx_6101_${user._id}`}>{user.name}</p>
                          <p
                            className="text-xs text-gray-500"
                            data-icod-id={`src_pages_admin_adminusers_jsx_8fc3_${user._id}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell"
                      data-icod-id={`src_pages_admin_adminusers_jsx_2843_${user._id}`}>{user.phone || '—'}</td>
                    <td
                      className="px-5 py-3"
                      data-icod-id={`src_pages_admin_adminusers_jsx_11da_${user._id}`}>
                      <span
                        className="text-sm font-bold text-gray-800 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full"
                        data-icod-id={`src_pages_admin_adminusers_jsx_63cc_${user._id}`}>
                        {user.orderCount}
                      </span>
                    </td>
                    <td
                      className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell"
                      data-icod-id={`src_pages_admin_adminusers_jsx_61e1_${user._id}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="flex items-center justify-between p-4 border-t border-gray-100"
              data-icod-id="src_pages_admin_adminusers_jsx_7507">
              <p
                className="text-sm text-gray-500"
                data-icod-id="src_pages_admin_adminusers_jsx_ba0c">{total} total users</p>
              <div className="flex gap-2" data-icod-id="src_pages_admin_adminusers_jsx_ab25">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminusers_jsx_364a">Prev</button>
                <button
                  disabled={page * 20 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminusers_jsx_dd48">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
