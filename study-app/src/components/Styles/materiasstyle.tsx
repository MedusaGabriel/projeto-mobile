import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },

  // Text styles
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },

  // Day selection styles
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    color: '#fff',
  },

  // Time range selection styles
  timeRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  timeRangeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#007bff',
  },
  timeRangeText: {
    color: '#fff',
  },

  // Form styles
  formContainer: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },

  // Add button styles
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Subject list styles
  subjectList: {
    marginTop: 20,
    width: '80%',
  },
  subjectContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectDetails: {
    marginTop: 5,
  },
  subjectDetailText: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    marginLeft: 10,
  },

  // Edit button styles
  editButton: {
    marginLeft: 10,
  },

  // Submit button styles
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default styles;
