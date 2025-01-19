import 'package:area/profile.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:area/main.dart';
import 'package:http/http.dart' as http;
import '../globals.dart' as globals;

class AuthSpotify {
  static Future<bool> login(String code) async {
    try {
      var userId = await globals.storage.read(key: 'id');
      Uri uriBackSpotify = Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/spotify/callback/?code=$code&redirect_uri=${dotenv.env['SPOTIFY_REDIRECT_URI']}&state=$userId');
      final response = await http.get(uriBackSpotify);

      if (response.statusCode == 200) {
        if (globals.isLoggedIn == true) {
          Fluttertoast.showToast(
            msg: 'Service connected successfully',
            backgroundColor: Colors.green,
          );
          globals.navigatorKey.currentState!
              .popUntil(ModalRoute.withName(routeHome));
          globals.navigatorKey.currentState!.pushNamed(routeHome);
        }
      } else {
        Fluttertoast.showToast(
          msg: 'Login failed',
          backgroundColor: Colors.red,
        );
      }
      globals.navigatorKey.currentState!
          .popUntil(ModalRoute.withName(routeHome));
      globals.navigatorKey.currentState!.pushNamed(routeHome);
      return true;
    } catch (error) {
      Fluttertoast.showToast(
        msg: 'Login OAuth failed',
        backgroundColor: Colors.red,
      );
      return false;
    }
  }
}

var httpUri = Uri(
  scheme: 'https',
  host: 'accounts.spotify.com',
  path: '/authorize',
  queryParameters: {
    'client_id': '${dotenv.env['SPOTIFY_CLIENT_ID']}',
    'redirect_uri': '${dotenv.env['SPOTIFY_REDIRECT_URI']}',
    'response_type': 'code',
    'scope': [
      "user-library-read",
      "playlist-read-private",
      "user-top-read",
      "user-read-playback-state",
      "playlist-modify-private",
      "playlist-modify-public",
    ].join(" "),
  }
);

class OAuthSpotifyPage extends StatelessWidget {
  const OAuthSpotifyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Connection Oauth Spotify')),
      body: WebViewWidget(controller: WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {},
          onPageFinished: (String url) {},
          onWebResourceError: (WebResourceError error) {},
          onNavigationRequest: (NavigationRequest request) {
            var uri = Uri.parse(dotenv.env['SPOTIFY_REDIRECT_URI']??"error");
            if (request.url.startsWith(uri.toString())) {
              var requestUri = Uri.parse(request.url);
              AuthSpotify.login(requestUri.queryParameters['code'] ?? "");
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..setUserAgent("Chrome")
      ..loadRequest(httpUri)
      ),
    );
  }
}


