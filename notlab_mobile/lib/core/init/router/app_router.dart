import 'package:auto_route/auto_route.dart';
import 'package:notlab/core/init/router/app_router.gr.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:notlab/features/home/presentation/pages/home_page.dart';

part 'app_router.g.dart';

@riverpod
RootStackRouter appRouter(AppRouterRef ref) {
  return AppRouter();
}

@AutoRouterConfig()
class AppRouter extends $AppRouter {
  @override
  List<AutoRoute> get routes => [
        // Ana sayfa rotası
        AutoRoute(
          page: HomeRoute.page,
          initial: true,
          path: '/',
        ),
        // Diğer rotalar...
      ];
}
