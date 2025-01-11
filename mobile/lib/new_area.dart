import 'package:area/new_area/input_field.dart';
import 'package:area/new_area/service_card.dart';
import 'package:area/new_area/trigger_card.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:convert';
import 'globals.dart' as globals;

class NewAreaPage extends StatefulWidget {
  const NewAreaPage({super.key});

  @override
  State<NewAreaPage> createState() => _NewAreaPageState();
}

class _NewAreaPageState extends State<NewAreaPage> {
  String currentStep = 'trigger-service';

  bool loading = true;
  bool loadingActions = true;
  bool loadingReactions = true;
  bool submitting = false;

  Map<String, dynamic>? selectedService;
  Map<String, dynamic>? selectedAction;
  Map<String, dynamic>? selectedReaction;
  Map<String, dynamic>? selectedReactionService;

  Map<String, String> actionData = {};
  Map<String, String> reactionData = {};
  String name = '';

  List<dynamic> availableServices = [];
  List<dynamic> availableActions = [];
  List<dynamic> availableReactions = [];

  final Map<String, TextEditingController> _controllers = {};

  String capitalizeFirst(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }

  String formatSnakeCase(String text) {
    return text
        .split('_')
        .map((word) => capitalizeFirst(word.toLowerCase()))
        .join(' ');
  }

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  void dispose() {
    for (var controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> fetchData() async {
    try {
      var token = await globals.storage.read(key: 'token');
      if (!mounted) return;
      if (token == null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error: Token not found')),
        );
        return;
      }

      final actionsResponse = await http.get(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/actions'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final reactionsResponse = await http.get(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/reactions'),
        headers: {'Authorization': 'Bearer $token'},
      );

      setState(() {
        availableActions = json.decode(actionsResponse.body);
        availableReactions = json.decode(reactionsResponse.body);
        loading = false;
        loadingActions = false;
        loadingReactions = false;
      });
    } catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${err.toString()}')),
      );
    }
  }

  Future<void> handleSubmit() async {
    if (!mounted) return;
    final navigatorContext = Navigator.of(context);
    final scaffoldContext = ScaffoldMessenger.of(context);

    if (name.trim().isEmpty) {
      scaffoldContext.showSnackBar(
        const SnackBar(content: Text('Please enter a name')),
      );
      return;
    }

    setState(() => submitting = true);

    try {
      var token = await globals.storage.read(key: 'token');
      var userId = await globals.storage.read(key: 'id');

      if (userId == null) {
        throw Exception('User ID not found');
      }

      final payload = {
        'name': name,
        'sessionId': userId,
        'actions': [
          {
            'name': selectedAction!['name'],
            'serviceId': selectedAction!['service']['id'],
            'data': Map.fromEntries(
              actionData.entries.map((e) => MapEntry(
                    e.key.replaceFirst('action_', ''),
                    e.value,
                  )),
            ),
            'isActive': true
          }
        ],
        'reactions': [
          {
            'name': selectedReaction!['name'],
            'serviceId': selectedReaction!['service']['id'],
            'data': Map.fromEntries(
              reactionData.entries.map((e) => MapEntry(
                    e.key.replaceFirst('reaction_', ''),
                    e.value,
                  )),
            ),
            'isActive': true,
            'trigger': {'reaction': selectedReaction!['name']}
          }
        ]
      };

      final response = await http.post(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/workflow'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
        body: json.encode(payload),
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to create workflow: ${response.body}');
      }

      if (!mounted) return;
      navigatorContext.pop();
      globals.navigatorKey.currentState
          ?.pushNamedAndRemoveUntil('/main', (route) => false);
    } catch (err) {
      if (!mounted) return;
      scaffoldContext.showSnackBar(
        SnackBar(content: Text('Error: ${err.toString()}')),
      );
    } finally {
      if (mounted) {
        setState(() => submitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(
                  color: Colors.grey[200]!,
                  width: 1,
                ),
              ),
            ),
            child: SafeArea(
              child: Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 600),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _buildStepper(),
                ),
              ),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCurrentStep(),
                ],
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(
                  color: Colors.grey[200]!,
                  width: 1,
                ),
              ),
            ),
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton.icon(
                  onPressed: () {
                    if (currentStep == 'trigger-service') {
                      globals.navigatorKey.currentState
                          ?.pushNamedAndRemoveUntil('/main', (route) => false);
                    } else {
                      setState(() {
                        switch (currentStep) {
                          case 'trigger-action':
                            currentStep = 'trigger-service';
                            break;
                          case 'trigger-data':
                            currentStep = 'trigger-action';
                            break;
                          case 'reaction-service':
                            currentStep = selectedAction!['body'] != null &&
                                    (selectedAction!['body'] as List).isNotEmpty
                                ? 'trigger-data'
                                : 'trigger-action';
                            break;
                          case 'reaction-action':
                            currentStep = 'reaction-service';
                            break;
                          case 'reaction-data':
                            currentStep = 'reaction-action';
                            break;
                          case 'name':
                            currentStep = selectedReaction!['body'] != null &&
                                    (selectedReaction!['body'] as List)
                                        .isNotEmpty
                                ? 'reaction-data'
                                : 'reaction-action';
                            break;
                        }
                      });
                    }
                  },
                  icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
                  label: const Text('Back'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.grey[700],
                    backgroundColor: Colors.grey[100],
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
                if (currentStep != 'name')
                  ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        switch (currentStep) {
                          case 'trigger-service':
                            if (selectedService != null) {
                              currentStep = 'trigger-action';
                            }
                            break;
                          case 'trigger-action':
                            if (selectedAction != null) {
                              currentStep = selectedAction!['body'] != null &&
                                      (selectedAction!['body'] as List)
                                          .isNotEmpty
                                  ? 'trigger-data'
                                  : 'reaction-service';
                            }
                            break;
                          case 'trigger-data':
                            currentStep = 'reaction-service';
                            break;
                          case 'reaction-service':
                            if (selectedReactionService != null) {
                              currentStep = 'reaction-action';
                            }
                            break;
                          case 'reaction-action':
                            if (selectedReaction != null) {
                              currentStep = selectedReaction!['body'] != null &&
                                      (selectedReaction!['body'] as List)
                                          .isNotEmpty
                                  ? 'reaction-data'
                                  : 'name';
                            }
                            break;
                          case 'reaction-data':
                            currentStep = 'name';
                            break;
                        }
                      });
                    },
                    icon: const Text('Next'),
                    label: const Icon(Icons.arrow_forward, color: Colors.white),
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                  )
                else
                  ElevatedButton(
                    onPressed: submitting ? null : handleSubmit,
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                    ),
                    child: submitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Create Area'),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepper() {
    final steps = [
      {'key': 'trigger-service', 'label': 'Action'},
      {'key': 'reaction-service', 'label': 'Reaction'},
      {'key': 'name', 'label': 'Name'}
    ];

    bool isStepActive(String stepKey) {
      if (stepKey == 'trigger-service') {
        return currentStep.startsWith('trigger-');
      } else if (stepKey == 'reaction-service') {
        return currentStep.startsWith('reaction-');
      } else {
        return currentStep == stepKey;
      }
    }

    bool isStepComplete(String stepKey) {
      if (stepKey == 'trigger-service') {
        return currentStep.startsWith('reaction-') || currentStep == 'name';
      } else if (stepKey == 'reaction-service') {
        return currentStep == 'name';
      }
      return false;
    }

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: steps.map((step) {
            final isActive = isStepActive(step['key']!);
            final isCompleted = isStepComplete(step['key']!);
            final color = isActive || isCompleted ? Colors.black : Colors.grey;

            return Expanded(
              child: Column(
                children: [
                  Text(
                    step['label']!,
                    style: TextStyle(
                      fontSize: 12,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 60,
                    height: 4,
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildCurrentStep() {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    switch (currentStep) {
      case 'trigger-service':
        return _buildServiceList(true);
      case 'trigger-action':
        return _buildActionList();
      case 'trigger-data':
        return _buildDataForm(selectedAction!['body'], actionData, 'action_');
      case 'reaction-service':
        return _buildServiceList(false);
      case 'reaction-action':
        return _buildReactionList();
      case 'reaction-data':
        return _buildDataForm(
            selectedReaction!['body'], reactionData, 'reaction_');
      case 'name':
        return _buildNameForm();
      default:
        return const Text('Unknown step');
    }
  }

  Widget _buildServiceList(bool isAction) {
    final items = isAction ? availableActions : availableReactions;

    Map<int, Map<String, dynamic>> uniqueServices = {};
    Map<int, int> actionCounts = {};

    for (var item in items) {
      if (item['service'] != null) {
        final service = item['service'];
        final serviceId = service['id'];

        uniqueServices[serviceId] = service;
        actionCounts[serviceId] = (actionCounts[serviceId] ?? 0) + 1;
      }
    }

    final services = uniqueServices.values.toList();

    if (services.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'No Services Available',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Text(
              isAction
                  ? 'No services with actions are currently available'
                  : 'No services with reactions are currently available',
              style: const TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: services.length,
      itemBuilder: (context, index) {
        final service = services[index];
        final count = actionCounts[service['id']] ?? 0;
        final isSelected = isAction
            ? (selectedService != null &&
                selectedService!['id'] == service['id'])
            : (selectedReactionService != null &&
                selectedReactionService!['id'] == service['id']);

        return ServiceCard(
          service: service,
          isSelected: isSelected,
          onTap: () {
            setState(() {
              if (isAction) {
                selectedService = service;
              } else {
                selectedReactionService = service;
              }
            });
          },
          count: count,
          isAction: isAction,
          description: service['description'],
        );
      },
    );
  }

  Widget _buildActionList() {
    final actions = availableActions
        .where((a) => a['service']['id'] == selectedService!['id'])
        .toList();

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: actions.length,
      itemBuilder: (context, index) {
        final action = actions[index];
        return TriggerCard(
          trigger: action,
          isSelected: selectedAction != null &&
              selectedAction!['name'] == action['name'],
          onTap: () => setState(() => selectedAction = action),
          isAction: true,
        );
      },
    );
  }

  Widget _buildReactionList() {
    final reactions = availableReactions
        .where((r) => r['service']['id'] == selectedReactionService!['id'])
        .toList();

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: reactions.length,
      itemBuilder: (context, index) {
        final reaction = reactions[index];
        return TriggerCard(
          trigger: reaction,
          isSelected: selectedReaction != null &&
              selectedReaction!['name'] == reaction['name'],
          onTap: () => setState(() => selectedReaction = reaction),
          isAction: false,
        );
      },
    );
  }

  Widget _buildNameForm() {
    return TextField(
      decoration: const InputDecoration(
        labelText: 'Area Name',
        border: OutlineInputBorder(),
      ),
      onChanged: (value) => setState(() => name = value),
    );
  }

  Widget _buildDataForm(
      List<dynamic> fields, Map<String, String> data, String prefix) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ...fields.map((field) {
          if (field == null || field['field'] == null) {
            return const SizedBox.shrink();
          }

          final fieldKey = prefix + (field['field'] as String);
          final value = data[fieldKey] ?? '';
          final fieldName =
              field['name'] ?? formatSnakeCase(field['field'] as String);

          _controllers[fieldKey] ??= TextEditingController(text: value);
          final controller = _controllers[fieldKey]!;

          Widget inputField;
          if (field['field'] == 'date') {
            inputField = CustomDateField(
              label: fieldName,
              helperText: field['description'] as String?,
              controller: controller,
              onDateSelected: (date) {
                setState(() {
                  data[fieldKey] = date.toIso8601String().split('T')[0];
                  controller.text = data[fieldKey]!;
                });
              },
            );
          } else if (field['field'] == 'hour') {
            inputField = CustomTimeField(
              label: fieldName,
              helperText: field['description'] as String?,
              controller: controller,
              onTimeSelected: (time) {
                setState(() {
                  data[fieldKey] =
                      '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                  controller.text = data[fieldKey]!;
                });
              },
            );
          } else {
            inputField = BaseTextField(
              label: fieldName,
              helperText: field['description'] as String?,
              controller: controller,
              onChanged: (value) {
                setState(() {
                  data[fieldKey] = value;
                });
              },
            );
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: inputField,
          );
        })
      ],
    );
  }
}
