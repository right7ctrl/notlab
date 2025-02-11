import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:notlab/core/init/app_init.dart';
import 'package:notlab/core/init/router/app_router.dart';

void main() async {
  await AppInit.init();

  runApp(
    const ProviderScope(
      child: NotLabApp(),
    ),
  );
}

class NotLabApp extends ConsumerWidget {
  const NotLabApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'NotLab',
      routerConfig: router.config(),
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
    );
  }
}
