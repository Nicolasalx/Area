library area.globals;

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

bool isLoggedIn = false;
FlutterSecureStorage storage = const FlutterSecureStorage();
GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
