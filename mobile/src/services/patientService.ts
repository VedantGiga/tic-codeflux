export const patientService = {
  getAll: async () => {
    return [
      { id: '1', name: 'John Doe', medicineName: 'Paracetamol', dosage: '500mg', scheduledTime: '10:00 AM', status: 'taken' },
      { id: '2', name: 'Jane Smith', medicineName: 'Amoxicillin', dosage: '250mg', scheduledTime: '11:00 AM', status: 'missed' }
    ];
  },
  updateDoseStatus: async (logId, status) => {
    return true;
  }
};
