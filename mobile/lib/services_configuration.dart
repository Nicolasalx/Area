import 'dart:convert';
import 'package:area/profile.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'globals.dart' as globals;
import 'package:http/http.dart' as http;
import 'package:flutter_svg/flutter_svg.dart';
import 'package:area/svg_services.dart';

class Service {
  final int id;
  final String name;
  final String description;
  final bool isSet;
  final bool oauthNeed;

  Service({
    required this.id,
    required this.name,
    required this.description,
    required this.isSet,
    required this.oauthNeed,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      isSet: json['isSet'],
      oauthNeed: json['oauthNeed'],
    );
  }
}

class ServicesConfigurationPage extends StatefulWidget {
  final Function callback;
  const ServicesConfigurationPage({super.key, required this.callback});

  @override
  State<ServicesConfigurationPage> createState() =>
      _ServicesConfigurationPageState();
}

class _ServicesConfigurationPageState extends State<ServicesConfigurationPage> {
  List<Service> services = [];
  bool isLoading = true;
  final Map<int, TextEditingController> apiKeyControllers = {};

  @override
  void initState() {
    super.initState();
    fetchServices();
  }

  @override
  void dispose() {
    for (var controller in apiKeyControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> fetchServices() async {
    try {
      final userId = await globals.storage.read(key: 'id');
      final token = await globals.storage.read(key: 'token');
      final server = await globals.storage.read(key: 'server');

      final response = await http.get(
        Uri.parse('http://$server/auth/$userId'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          services = data.map((json) => Service.fromJson(json)).toList();
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load services');
      }
    } catch (error) {
      Fluttertoast.showToast(
        msg: 'Failed to load services',
        backgroundColor: Colors.red,
      );
      setState(() => isLoading = false);
    }
  }

  Future<void> handleOAuthConnect(String serviceName) async {
    switch (serviceName.toLowerCase()) {
      case 'github':
        globals.navigatorKey.currentState!.pushNamed('/oauth/github');
        break;
      case 'google':
        globals.navigatorKey.currentState!.pushNamed('/oauth/google');
        break;
      case 'discord':
        globals.navigatorKey.currentState!.pushNamed('/oauth/discord');
        break;
      case 'spotify':
        globals.navigatorKey.currentState!.pushNamed('/oauth/spotify');
        break;
      case 'trello':
        globals.navigatorKey.currentState!.pushNamed('/oauth/trello');
        break;
      default:
        Fluttertoast.showToast(
          msg: 'Unsupported OAuth service',
          backgroundColor: Colors.red,
        );
    }
  }

  Future<void> handleOAuthDisconnect(int serviceId) async {
    try {
      final userId = await globals.storage.read(key: 'id');
      final token = await globals.storage.read(key: 'token');
      final server = await globals.storage.read(key: 'server');

      final response = await http.delete(
        Uri.parse('http://$server/auth/service/delete'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId': userId,
          'serviceId': serviceId,
        }),
      );

      if (response.statusCode == 200) {
        await fetchServices();
        Fluttertoast.showToast(
          msg: 'Service disconnected successfully',
          backgroundColor: Colors.green,
        );
      } else {
        throw Exception('Failed to disconnect service');
      }
    } catch (error) {
      Fluttertoast.showToast(
        msg: 'Failed to disconnect service',
        backgroundColor: Colors.red,
      );
    }
  }

  Future<void> handleApiKeySubmit(int serviceId, String apiKey) async {
    try {
      final userId = await globals.storage.read(key: 'id');
      final token = await globals.storage.read(key: 'token');
      final server = await globals.storage.read(key: 'server');

      if (apiKey.isEmpty) {
        Fluttertoast.showToast(
          msg: 'API key cannot be empty',
          backgroundColor: Colors.red,
        );
        return;
      }

      final response = await http.post(
        Uri.parse('http://$server/auth/service/apikey'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId': userId,
          'serviceId': serviceId,
          'apiKey': apiKey,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchServices();
        Fluttertoast.showToast(
          msg: 'API key set successfully',
          backgroundColor: Colors.green,
        );
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to set API key');
      }
    } catch (error) {
      Fluttertoast.showToast(
        msg: error.toString(),
        backgroundColor: Colors.red,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Services Configuration',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: services.length,
                    itemBuilder: (context, index) {
                      final service = services[index];
                      if (!apiKeyControllers.containsKey(service.id)) {
                        apiKeyControllers[service.id] = TextEditingController();
                      }
                      return Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            color: Colors.grey[100],
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Center(
                                            child: SvgPicture.string(
                                              getServiceSvg(service.name),
                                              width: 32,
                                              height: 32,
                                              fit: BoxFit.contain,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Text(
                                            service.name
                                                    .substring(0, 1)
                                                    .toUpperCase() +
                                                service.name.substring(1),
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      Icon(
                                        service.isSet
                                            ? Icons.circle
                                            : Icons.circle_outlined,
                                        size: 12,
                                        color: service.isSet
                                            ? Colors.green
                                            : Colors.red,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        service.isSet
                                            ? 'Connected'
                                            : 'Not Connected',
                                        style: TextStyle(
                                          color: service.isSet
                                              ? Colors.green
                                              : Colors.red,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                service.description,
                                style: TextStyle(
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 16),
                              if (service.isSet)
                                ElevatedButton(
                                  onPressed: () =>
                                      handleOAuthDisconnect(service.id),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.black,
                                    minimumSize: const Size.fromHeight(40),
                                  ),
                                  child: const Text(
                                    'Disconnect',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                )
                              else if (service.oauthNeed)
                                ElevatedButton(
                                  onPressed: () =>
                                      handleOAuthConnect(service.name),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.black,
                                    minimumSize: const Size.fromHeight(40),
                                  ),
                                  child: Text(
                                    'Connect with ${service.name}',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                )
                              else if (service.name == "trello")
                                ElevatedButton(
                                  onPressed: () =>
                                      handleOAuthConnect(service.name),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.black,
                                    minimumSize: const Size.fromHeight(40),
                                  ),
                                  child: Text(
                                    'Connect with ${service.name}',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                )
                              else
                                Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: [
                                    TextField(
                                      controller: apiKeyControllers[service.id],
                                      decoration: const InputDecoration(
                                        hintText: 'Enter API Key',
                                        border: OutlineInputBorder(),
                                        contentPadding: EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 8,
                                        ),
                                      ),
                                      obscureText: true,
                                    ),
                                    const SizedBox(height: 8),
                                    ElevatedButton(
                                      onPressed: () => handleApiKeySubmit(
                                        service.id,
                                        apiKeyControllers[service.id]!.text,
                                      ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.black,
                                        minimumSize: const Size.fromHeight(40),
                                      ),
                                      child: const Text(
                                        'Validate',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
          SizedBox(
            width: double.infinity,
            height: 70,
            child: Row(
              children: [
                ProfileButton(
                  text: const Text(
                    ' Back',
                    style: TextStyle(
                      fontSize: 22,
                      color: Colors.black,
                    ),
                  ),
                  path: '',
                  icon: const Icon(
                    Icons.arrow_back,
                    size: 30,
                    color: Colors.black,
                  ),
                  fun: () {
                    widget.callback(routeProfile);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
