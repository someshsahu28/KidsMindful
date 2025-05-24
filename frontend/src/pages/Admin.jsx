import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';

function Admin() {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, moodResponse] = await Promise.all([
          fetch('http://localhost:3001/api/users'),
          fetch('http://localhost:3001/api/mood-entries')
        ]);

        const usersData = await usersResponse.json();
        const moodData = await moodResponse.json();

        setUsers(usersData);
        setMoodEntries(moodData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" gutterBottom>
        Database Viewer
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Users" />
          <Tab label="Mood Entries" />
        </Tabs>
      </Box>

      {value === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {value === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Mood</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {moodEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.userId}</TableCell>
                  <TableCell>{entry.mood}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default Admin; 