const StatusBadge = ({ status }) => {
  const cls =
    status === 'In Stock'    ? 'badge-green' :
    status === 'Low Stock'   ? 'badge-gold'  :
                               'badge-red';
  return <span className={`badge ${cls}`}>{status}</span>;
};

export default StatusBadge;
