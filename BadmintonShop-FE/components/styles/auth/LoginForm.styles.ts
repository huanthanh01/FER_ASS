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
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "700",
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
