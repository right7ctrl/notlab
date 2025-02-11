import 'package:shared_preferences/shared_preferences.dart';

class SharedPrefsService {
  SharedPrefsService._();
  static final SharedPrefsService _instance = SharedPrefsService._();
  static SharedPrefsService get instance => _instance;

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // String değerleri
  Future<bool> setString(String key, String value) async {
    return await _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  // Bool değerleri
  Future<bool> setBool(String key, bool value) async {
    return await _prefs.setBool(key, value);
  }

  bool? getBool(String key) {
    return _prefs.getBool(key);
  }

  // Int değerleri
  Future<bool> setInt(String key, int value) async {
    return await _prefs.setInt(key, value);
  }

  int? getInt(String key) {
    return _prefs.getInt(key);
  }

  // Tüm anahtarları temizle
  Future<bool> clear() async {
    return await _prefs.clear();
  }

  // Belirli bir anahtarı sil
  Future<bool> remove(String key) async {
    return await _prefs.remove(key);
  }

  // Tüm anahtarları getir
  Set<String> getKeys() {
    return _prefs.getKeys();
  }

  // Bir anahtarın var olup olmadığını kontrol et
  bool hasKey(String key) {
    return _prefs.containsKey(key);
  }
}
