import { useState, useEffect } from 'react';

export const usePatients = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mocking an API call
    setTimeout(() => {
      setData([
        { id: '1', name: 'John Doe', status: 'taken', medicineName: 'Paracetamol', dosage: '500mg', scheduledTime: '10:00 AM' },
        { id: '2', name: 'Jane Smith', status: 'missed', medicineName: 'Amoxicillin', dosage: '250mg', scheduledTime: '11:00 AM' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { isLoading, data };
};
