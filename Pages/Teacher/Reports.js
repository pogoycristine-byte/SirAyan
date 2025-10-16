import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const mockAttendanceData = [
  { date: '2025-10-01', name: 'Alice', status: 'present' },
  { date: '2025-10-01', name: 'Bob', status: 'absent' },
  { date: '2025-10-02', name: 'Alice', status: 'late' },
  { date: '2025-10-02', name: 'Bob', status: 'present' },
  { date: '2025-10-03', name: 'Alice', status: 'present' },
  { date: '2025-10-03', name: 'Bob', status: 'present' },
];

const Reports = () => {
  const [data, setData] = useState(mockAttendanceData || []);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const filtered = (data || []).filter(record => {
      if (!record) return false;
      const dateCheck = selectedDate ? record.date === selectedDate : true;
      const statusCheck = statusFilter === 'all' || record.status === statusFilter;
      return dateCheck && statusCheck;
    });
    setFilteredData(filtered || []);
  }, [data, selectedDate, statusFilter]);

  const SmallButton = ({ title, onPress, active }) => (
    <TouchableOpacity
      style={[styles.smallButton, active ? styles.activeButton : {}]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date.toISOString().split('T')[0]);
  };

  const summary = (filteredData || []).reduce((acc, r) => {
    if (!r) return acc;
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'Present', population: summary.present || 0, color: '#2563EB', legendFontColor: '#000', legendFontSize: 16 },
    { name: 'Absent', population: summary.absent || 0, color: '#EF4444', legendFontColor: '#000', legendFontSize: 16 },
  ];

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Attendance Reports</Text>
      <View style={styles.buttonRow}>
        <SmallButton
          title={selectedDate ? selectedDate : 'Select Date'}
          onPress={() => setShowDatePicker(true)}
          active={!!selectedDate}
        />
        <SmallButton title="All" onPress={() => setStatusFilter('all')} active={statusFilter === 'all'} />
        <SmallButton title="Present" onPress={() => setStatusFilter('present')} active={statusFilter === 'present'} />
        <SmallButton title="Absent" onPress={() => setStatusFilter('absent')} active={statusFilter === 'absent'} />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
          style={{ width: '100%' }}
        />
      )}
      <Text style={styles.sectionTitle}>Attendance Table</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>Date</Text>
        <Text style={[styles.cell, styles.headerCell]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Status</Text>
      </View>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.chartSection}>
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#E0F2FE',
          backgroundGradientTo: '#DBEAFE',
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={false}
      />
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: '#2563EB' }]} />
          <Text style={styles.legendText}>{summary.present || 0} Present</Text>
        </View>
        <View style={[styles.legendItem, { marginLeft: 25 }]}>
          <View style={[styles.legendColorBox, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>{summary.absent || 0} Absent</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
            <Text style={[styles.cell, styles.boldCell]}>{item.date || '-'}</Text>
            <Text style={[styles.cell, styles.boldCell]}>{item.name || '-'}</Text>
            <Text style={[styles.cell, styles.boldCell]}>{item.status || '-'}</Text>
          </View>
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F6FF', paddingTop: 10 },
  headerContainer: { paddingHorizontal: 15, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E3A8A', textAlign: 'center', marginBottom: 20 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    marginBottom: 1,
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#93C5FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginTop: 10,
    textAlign: 'left',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#BFDBFE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 6,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  rowEven: { backgroundColor: '#F8FAFF' },
  rowOdd: { backgroundColor: '#FFFFFF' },
  cell: { flex: 1, textAlign: 'center', fontSize: 15, color: '#1E3A8A' },
  boldCell: { fontWeight: '700' },
  headerCell: { fontWeight: '800' },
  chartSection: { marginTop: 25, alignItems: 'center' },
  legendRow: { flexDirection: 'row', marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColorBox: { width: 16, height: 16, marginRight: 6, borderRadius: 3 },
  legendText: { fontSize: 15, color: '#1E3A8A', fontWeight: '600' },
});

export default Reports;
