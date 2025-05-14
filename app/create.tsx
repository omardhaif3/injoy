import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useI18n } from 'hooks/useI18n';
import { useCreatePost } from 'hooks/useCreatePost';
import Header from 'components/Header';
import Button from 'components/Button';
import { X, Plus, Trash2 } from 'lucide-react-native';
import colors from 'constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const MAX_OPTIONS = 4;
const MIN_OPTIONS = 2;

export default function CreateScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const { createPost, loading } = useCreatePost();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 empty options
  const [errors, setErrors] = useState({
    question: '',
    options: ''
  });

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > MIN_OPTIONS) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const updateOption = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { question: '', options: '' };

    if (!question.trim()) {
      newErrors.question = t('questionRequired');
      valid = false;
    }

    const emptyOptions = options.some(option => !option.trim());
    if (emptyOptions) {
      newErrors.options = t('allOptionsRequired');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const newPost = await createPost({
        question,
        options: options.map(text => ({ text, votes: 0 }))
      });

      if (newPost && newPost._id) {
        router.replace(`/post/${newPost._id}`);
      }
    } catch (error) {
      Alert.alert(t('error'), t('createPostError'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={[styles.container, isRTL && styles.rtlContainer]}>
          <Header 
            title={t('createPost')} 
            leftIcon="x"
            onLeftPress={() => router.back()}
          />

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formSection}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('questionLabel')}</Text>
              <TextInput
                style={[
                  styles.questionInput, 
                  isRTL && styles.rtlText,
                  errors.question ? styles.inputError : null
                ]}
                placeholder={t('questionPlaceholder')}
                placeholderTextColor={colors.textLight}
                value={question}
                onChangeText={setQuestion}
                multiline
                maxLength={200}
                textAlign={isRTL ? 'right' : 'left'}
              />
              {errors.question ? (
                <Text style={styles.errorText}>{errors.question}</Text>
              ) : null}
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('optionsLabel')}</Text>
              {errors.options ? (
                <Text style={styles.errorText}>{errors.options}</Text>
              ) : null}

              {options.map((option, index) => (
                <Animated.View 
                  key={index}
                  style={styles.optionRow}
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(200)}
                >
                  <TextInput
                    style={[
                      styles.optionInput, 
                      isRTL && styles.rtlText,
                      errors.options ? styles.inputError : null
                    ]}
                    placeholder={`${t('optionPlaceholder')} ${index + 1}`}
                    placeholderTextColor={colors.textLight}
                    value={option}
                    onChangeText={(text) => updateOption(text, index)}
                    maxLength={100}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                  
                  {options.length > MIN_OPTIONS && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeOption(index)}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                      <Trash2 size={18} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              ))}

              {options.length < MAX_OPTIONS && (
                <TouchableOpacity 
                  style={[styles.addOptionButton, isRTL && styles.rtlButton]} 
                  onPress={addOption}
                >
                  <Plus size={18} color={colors.primary} />
                  <Text style={[styles.addOptionText, isRTL && styles.rtlText]}>
                    {t('addOption')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title={t('createPostButton')}
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlButton: {
    flexDirection: 'row-reverse',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  questionInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    justifyContent: 'center',
  },
  addOptionText: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  }
});
