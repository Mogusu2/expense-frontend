// components/Admin/UserManagement.jsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import PropTypes from 'prop-types';

const UserManagement = ({ users = [], onEditUser = () => {}, onDeleteUser = () => {} }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEditUser(user.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDeleteUser(user.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

UserManagement.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ),
  onEditUser: PropTypes.func,
  onDeleteUser: PropTypes.func,
};

export default UserManagement;
