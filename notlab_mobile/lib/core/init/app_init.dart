import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AppInit {
  static Future<void> init() async {
    WidgetsFlutterBinding.ensureInitialized();

    await _initSupabase();
    _registerDependencies();
  }

  static Future<void> _initSupabase() async {
    await Supabase.initialize(
      url: 'SUPABASE_URL',
      anonKey: 'SUPABASE_ANON_KEY',
    );
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
