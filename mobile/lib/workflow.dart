class WorkflowTriggerResponse {
  WorkflowTriggerResponse({required this.reaction});
  final String reaction;

  factory WorkflowTriggerResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowTriggerResponse(reaction: data['reaction']);
  }
}

class WorkflowDataResponse {
  WorkflowDataResponse({
    required this.name,
    required this.description,
  });
  final String name;
  final String description;

  factory WorkflowDataResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowDataResponse(
      name: data['name'],
      description: data['description'],
    );
  }
}

class ServiceResponse {
  ServiceResponse({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.createdAt,
  });
  final int id;
  final String name;
  final String description;
  final bool isActive;
  final String createdAt;

  factory ServiceResponse.fromJson(Map<String, dynamic> data) {
    return ServiceResponse(
      id: data['id'],
      name: data['name'],
      description: data['description'],
      isActive: data['isActive'],
      createdAt: data['createdAt'],
    );
  }
}

class ActionsResponse {
  ActionsResponse({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.createdAt,
    required this.serviceId,
    required this.service,
    required this.data,
  });
  final int id;
  final String name;
  final String description;
  final bool isActive;
  final String createdAt;
  final String serviceId;
  final ServiceResponse service;
  final List<WorkflowDataResponse> data;

  factory ActionsResponse.fromJson(Map<String, dynamic> data) {
    final datas = data['data'] as List<dynamic>?;
    return ActionsResponse(
      id: data['id'],
      name: data['name'],
      description: data['description'],
      isActive: data['isActive'],
      createdAt: data['createdAt'],
      serviceId: data['serviceId'],
      service: ServiceResponse.fromJson(data['service']),
      data: datas != null
          ? datas
              .map((dataWorkflow) => WorkflowDataResponse.fromJson(
                  dataWorkflow as Map<String, dynamic>))
              .toList()
          : <WorkflowDataResponse>[],
    );
  }
}

class ReactionsResponse {
  ReactionsResponse({
    required this.id,
    required this.name,
    required this.description,
    required this.trigger,
    required this.isActive,
    required this.createdAt,
    required this.serviceId,
    required this.service,
    required this.data,
  });
  final int id;
  final String name;
  final String description;
  final WorkflowTriggerResponse trigger;
  final bool isActive;
  final String createdAt;
  final String serviceId;
  final ServiceResponse service;
  final List<WorkflowDataResponse> data;

  factory ReactionsResponse.fromJson(Map<String, dynamic> data) {
    final datas = data['data'] as List<dynamic>?;
    return ReactionsResponse(
      id: data['id'],
      name: data['name'],
      description: data['description'],
      trigger: WorkflowTriggerResponse.fromJson(data['trigger']),
      isActive: data['isActive'],
      createdAt: data['createdAt'],
      serviceId: data['serviceId'],
      service: ServiceResponse.fromJson(data['service']),
      data: datas != null
          ? datas
              .map((dataWorkflow) => WorkflowDataResponse.fromJson(
                  dataWorkflow as Map<String, dynamic>))
              .toList()
          : <WorkflowDataResponse>[],
    );
  }
}

class WorkflowResponse {
  WorkflowResponse({
    required this.id,
    required this.name,
    required this.isActive,
    required this.createdAt,
    required this.userId,
    required this.actions,
    required this.reactions,
  });
  final String id;
  final String name;
  final bool isActive;
  final String createdAt;
  final String userId;
  final List<ActionsResponse> actions;
  final List<ReactionsResponse> reactions;

  factory WorkflowResponse.fromJson(Map<String, dynamic> data) {
    final actionsList = data['actions'] as List<dynamic>?;
    final reactionsList = data['reactions'] as List<dynamic>?;
    return WorkflowResponse(
      id: data['id'],
      name: data['name'],
      isActive: data['isActive'],
      createdAt: data['createdAt'],
      userId: data['userId'],
      actions: actionsList != null
          ? actionsList
              .map((action) =>
                  ActionsResponse.fromJson(action as Map<String, dynamic>))
              .toList()
          : <ActionsResponse>[],
      reactions: reactionsList != null
          ? reactionsList
              .map((reaction) =>
                  ReactionsResponse.fromJson(reaction as Map<String, dynamic>))
              .toList()
          : <ReactionsResponse>[],
    );
  }
}

class JsonWorkflowResponse {
  JsonWorkflowResponse({required this.message, required this.data});
  final String message;
  final List<WorkflowResponse> data;

  factory JsonWorkflowResponse.fromJson(Map<String, dynamic> data) {
    final workflowList = data['data'] as List<dynamic>?;
    return JsonWorkflowResponse(
      message: data['message'],
      data: workflowList != null
          ? workflowList
              .map((reaction) =>
                  WorkflowResponse.fromJson(reaction as Map<String, dynamic>))
              .toList()
          : <WorkflowResponse>[],
    );
  }
}
