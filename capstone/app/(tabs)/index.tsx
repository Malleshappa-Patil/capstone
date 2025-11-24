import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PredictionData {
  pred_class: string;
  pred_conf: number;
  remedy: {
    symptoms?: string[] | string;
    causes?: string[] | string;
    treatment_steps?: string[] | string;
    prevention?: string[] | string;
    organic_solutions?: string[] | string;
    chemical_solutions?: string[] | string;
    estimated_recovery_time?: string;
    severity_level?: string;
    warning?: string;
  };
}

const API_URL = 'http://10.5.41.192:8001/predict'; // Change to your API URL if needed
// const API_URL = 'http://localhost:8000/predict'; // Change to your API URL if needed

export default function HomeScreen() {
  const [selectedFile, setSelectedFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const remedyRef = useRef(null);

  const sendFile = useCallback(async () => {
    if (selectedFile) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', {
          uri: selectedFile.uri,
          type: selectedFile.type || 'image/jpeg',
          name: selectedFile.fileName || 'image.jpg',
        } as any);
        const res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const result: PredictionData = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          Alert.alert('Error', 'Prediction failed');
        }
      } catch (error) {
        console.error('Prediction Error:', error);
        Alert.alert('Error', 'Network error');
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedFile]);

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setImageUploaded(false);
  };

  useEffect(() => {
    if (selectedFile) {
      setPreview(selectedFile.uri);
      setImageUploaded(true);
      sendFile();
    }
  }, [selectedFile, sendFile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const getPredClass = () => data?.pred_class || 'Unknown';
  const confidenceDisplay = ((data?.pred_conf || 0) * 100).toFixed(2);

  const renderSection = (title: string, content: any, icon = '') => {
    if (!content) return null;

    if (Array.isArray(content)) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{icon} {title}</Text>
          {content.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              {typeof item === 'object'
                ? Object.entries(item)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ')
                : item}
            </Text>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{icon} {title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
      </View>
    );
  };

  const renderRemedyContent = () => {
    const r = data?.remedy;
    if (!r) return null;

    return (
      <View>
        <Text style={styles.remediesTitle}>Remedies</Text>
        {renderSection('Symptoms', r.symptoms, '🌿')}
        {renderSection('Causes', r.causes, '🧬')}
        {renderSection('Treatment Steps', r.treatment_steps, '💊')}
        {renderSection('Prevention', r.prevention, '🛡️')}
        {renderSection('Organic Solutions', r.organic_solutions, '🌱')}
        {renderSection('Chemical Solutions', r.chemical_solutions, '🧪')}

        {r.estimated_recovery_time && (
          <Text style={styles.recoveryTime}>
            ⏱️ <Text style={styles.bold}>Estimated Recovery Time:</Text> {r.estimated_recovery_time}
          </Text>
        )}
        {r.severity_level && (
          <Text style={styles.severity}>
            ⚠️ <Text style={styles.bold}>Severity Level:</Text> {r.severity_level}
          </Text>
        )}
        {r.warning && (
          <Text style={[styles.warning, { color: '#d9534f' }]}>
            ⚠️ {r.warning}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tomato Disease Detection</Text>
      </View>

      {!imageUploaded && !isLoading && !data && (
        <View style={styles.uploadCard}>
          <Text style={styles.uploadHeader}>Upload a Tomato Leaf Image</Text>
          <View style={styles.tipsRow}>
            <Text style={styles.chip}>JPG/PNG</Text>
            <Text style={styles.chip}>Max 5 MB</Text>
            <Text style={styles.chip}>1 image only</Text>
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Select Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && (
        <View style={styles.loaderSection}>
          <ActivityIndicator size="large" color="#be6a77" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      {data && !isLoading && (
        <View style={styles.resultWrapper} ref={remedyRef}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {preview && <Image source={{ uri: preview }} style={styles.media} />}
          </View>

          {/* Remedies Section */}
          <View style={styles.remediesContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Disease</Text>
                <Text style={styles.tableCell}>Confidence</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{getPredClass()}</Text>
                <Text style={styles.tableCell}>{confidenceDisplay}%</Text>
              </View>
            </View>

            {renderRemedyContent()}

            <TouchableOpacity style={styles.clearButton} onPress={clearData}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#be6a77',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  uploadHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b3540',
    marginBottom: 10,
  },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: '#be6a77',
    padding: 15,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  resultWrapper: {
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  remediesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  tableCell: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  remediesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 10,
  },
  recoveryTime: {
    fontSize: 14,
    marginTop: 10,
  },
  severity: {
    fontSize: 14,
  },
  warning: {
    fontSize: 14,
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#be6a77',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
