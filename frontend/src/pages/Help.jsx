import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import WebIcon from '@mui/icons-material/Web';

const emergencyContacts = [
  {
    name: 'Kids Help Phone',
    phone: '1-800-668-6868',
    description: 'Free, 24/7 counseling and support service for young people.',
    icon: <PhoneIcon />,
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free crisis counseling via text message.',
    icon: <ChatIcon />,
  },
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '1-800-273-8255',
    description: '24/7 support for people in distress.',
    icon: <PhoneIcon />,
  },
];

const resources = [
  {
    title: 'Mindfulness for Kids',
    description: 'Learn about mindfulness and meditation techniques suitable for children.',
    link: 'https://www.mindful.org/mindfulness-for-kids/',
    icon: <InfoIcon />,
  },
  {
    title: 'Child Mind Institute',
    description: 'Expert information about mental health and learning disorders.',
    link: 'https://childmind.org/',
    icon: <WebIcon />,
  },
  {
    title: 'Anxiety Canada Youth',
    description: 'Resources and tools for managing anxiety.',
    link: 'https://youth.anxietycanada.com/',
    icon: <WebIcon />,
  },
];

function Help() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" align="center" sx={{ mb: 2 }}>
          Need Help? We're Here! 💝
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 6, color: '#666' }}>
          Remember, it's okay to ask for help when you need it
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Typography variant="h2" gutterBottom>
                Emergency Contacts 🆘
              </Typography>
              <List>
                {emergencyContacts.map((contact, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 2,
                      backgroundColor: '#FFF',
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <ListItemIcon sx={{ color: '#FF9AA2' }}>
                      {contact.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: '#444' }}>
                          {contact.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body1"
                            sx={{ color: '#FF9AA2', fontWeight: 'bold' }}
                          >
                            {contact.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {contact.description}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Typography variant="h2" gutterBottom>
                Helpful Resources 📚
              </Typography>
              <Grid container spacing={2}>
                {resources.map((resource, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ color: '#FF9AA2', mt: 0.5 }}>
                            {resource.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {resource.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {resource.description}
                            </Typography>
                            <Button
                              variant="contained"
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                backgroundColor: '#FF9AA2',
                                '&:hover': { backgroundColor: '#FFB7B2' },
                              }}
                            >
                              Visit Website
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Box
          sx={{
            mt: 6,
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Remember 💭
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are not alone. There are people who want to help.
            <br />
            It's brave to ask for help when you need it.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
}

export default Help; 