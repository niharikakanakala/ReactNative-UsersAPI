import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

const App = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchData = () => {
      setIsLoading(true);
      setError(null);
      axios
        .get("https://synth.hackerearth.com/api/employees/")
        .then((response) => {
          const data = response.data;
          const filteredEmployees = data.filter(
            (employee) =>
              employee.last_name === "Bode" || employee.last_name === "Mueller"
          );
          setEmployees(filteredEmployees);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    };
  
    return (
      <View style={styles.container}>
        <Button style={styles.button} title="Fetch Users" onPress={fetchData} testID="fetch-button" />
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error.message}</Text>
        ) : (
          <>
            <Text style={styles.heading}>Employee List</Text>
            <ScrollView>
              {employees.map((employee) => (
                <View key={employee.id} style={styles.employeeContainer}>
                  <Text style={styles.employeeName}>
                    Name: {`${employee.first_name} ${employee.last_name}`}
                  </Text>
                  <Text style={styles.jobTitle}>
                    Job title: {employee.job_title}
                  </Text>
                  <Text style={styles.address}>Address: {employee.address}</Text>
                  <Text style={styles.dob}>
                    DOB: {employee.personal_details.date_of_birth}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
     flex: 1,
      paddingTop: 60,
      padding: 10,
      backgroundColor: "grey"
    },
    
    heading: {
      padding: 24,
      fontSize: 24,
      fontWeight: "bold",
      margin: 50,
      marginBottom: 16,
      color: "white"
    },
    employeeContainer: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#fff",
      padding: 16,
    },
    employeeName: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
    },
    jobTitle: {
      fontSize: 16,
      marginBottom: 4,
    },
    address: {
      fontSize: 16,
      marginBottom: 4,
    },
    dob: {
      fontSize: 16,
    },
    loadingText: {
      fontSize: 20,
      textAlign: "center",
      marginTop: 100,
    },
    errorText: {
      fontSize: 20,
      color: "red",
      textAlign: "center",
      marginTop: 100,
    },
  });

  export default App;