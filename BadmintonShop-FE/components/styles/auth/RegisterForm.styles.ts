import { StyleSheet } from "react-native";
import { AppColors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupLast: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
  },
  termsLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
