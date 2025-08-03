import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
const trainingPlan = require('./trainingPlan');

export default function App() {
  const [completed, setCompleted] = useState(0);
  const totalRuns = trainingPlan.reduce((sum, w) => sum + w.runs.length, 0);

  const currentWeek = trainingPlan[Math.floor(completed / 3)];
  const currentRunIndex = completed % 3;
  const currentRun = currentWeek ? currentWeek.runs[currentRunIndex] : null;

  const markComplete = () => {
    if (completed < totalRuns) {
      setCompleted(completed + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>10K Beginner Training</Text>
      {currentRun ? (
        <>
          <Text>Week {currentWeek.week} Run {currentRunIndex + 1}: {currentRun} km</Text>
          <Button title="Mark Complete" onPress={markComplete} />
        </>
      ) : (
        <Text>Plan complete! You are ready for 10K.</Text>
      )}
      <Text>Progress: {completed}/{totalRuns} runs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 20, marginBottom: 20 }
});
