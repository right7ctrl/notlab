import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:notlab/core/init/cache/shared_preferences_service.dart';

class AppInit {
  static Future<void> init() async {
    WidgetsFlutterBinding.ensureInitialized();

    await _initSupabase();
    await _initSharedPreferences();
    _registerDependencies();
  }

  static Future<void> _initSupabase() async {
    await Supabase.initialize(
      url: 'https://sgqhbhqtaxcoyuzfjozo.supabase.co',
      anonKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncWhiaHF0YXhjb3l1emZqb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODI5MDgsImV4cCI6MjA1NDg1ODkwOH0.5LzZQDFn6qD4-0s4Q15ke5d0AUsvnURYBg8hePrpDBY',
    );
  }

  static Future<void> _initSharedPreferences() async {
    await SharedPrefsService.instance.init();
  }

  static void _registerDependencies() {
    final getIt = GetIt.instance;

    // Servisler
    // getIt.registerSingleton<AuthService>(AuthService());

    // Repository'ler
    // getIt.registerSingleton<AuthRepository>(AuthRepository());

    // Controller'lar
    // getIt.registerLazySingleton<AuthController>(() => AuthController());
  }
}
