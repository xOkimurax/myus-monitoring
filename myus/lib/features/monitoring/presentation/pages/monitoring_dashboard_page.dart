import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/constants/app_theme.dart';
import '../../domain/repositories/permission_type.dart';
import '../bloc/monitoring_bloc.dart';

class MonitoringDashboardPage extends StatefulWidget {
  const MonitoringDashboardPage({super.key});

  @override
  State<MonitoringDashboardPage> createState() => _MonitoringDashboardPageState();
}

class _MonitoringDashboardPageState extends State<MonitoringDashboardPage> {
  @override
  void initState() {
    super.initState();
    context.read<MonitoringBloc>().add(const MonitoringStartRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Myus Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync),
            onPressed: () {
              context.read<MonitoringBloc>().add(const MonitoringSyncRequested());
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              // Handle logout
            },
          ),
        ],
      ),
      body: BlocBuilder<MonitoringBloc, MonitoringState>(
        builder: (context, state) {
          if (state is MonitoringLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is MonitoringError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 64, color: AppColors.error),
                  const SizedBox(height: 16),
                  Text(state.message),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<MonitoringBloc>().add(const MonitoringStartRequested());
                    },
                    child: const Text('Reintentar'),
                  ),
                ],
              ),
            );
          }

          if (state is MonitoringActive) {
            return _buildDashboard(state);
          }

          return const Center(child: Text('Inicializando...'));
        },
      ),
    );
  }

  Widget _buildDashboard(MonitoringActive state) {
    return RefreshIndicator(
      onRefresh: () async {
        context.read<MonitoringBloc>().add(const MonitoringSyncRequested());
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Status Card
          _buildStatusCard(state),
          const SizedBox(height: 16),
          // Permissions Card
          _buildPermissionsCard(state),
          const SizedBox(height: 16),
          // Quick Actions
          _buildQuickActions(),
          const SizedBox(height: 16),
          // Recent Activity
          _buildRecentActivity(),
        ],
      ),
    );
  }

  Widget _buildStatusCard(MonitoringActive state) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: state.isTracking ? AppColors.success : AppColors.error,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  state.isTracking ? 'Monitoreo Activo' : 'Monitoreo Detenido',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (state.lastSync != null)
              Text(
                'Última sincronización: ${_formatDateTime(state.lastSync!)}',
                style: TextStyle(color: Colors.grey[400]),
              ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      if (state.isTracking) {
                        context.read<MonitoringBloc>().add(const MonitoringStopRequested());
                      } else {
                        context.read<MonitoringBloc>().add(const MonitoringStartRequested());
                      }
                    },
                    icon: Icon(state.isTracking ? Icons.stop : Icons.play_arrow),
                    label: Text(state.isTracking ? 'Detener' : 'Iniciar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: state.isTracking ? AppColors.error : AppColors.success,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      context.read<MonitoringBloc>().add(const MonitoringSyncRequested());
                    },
                    icon: const Icon(Icons.sync),
                    label: const Text('Sincronizar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPermissionsCard(MonitoringActive state) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Permisos',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildPermissionTile(
              'Notificaciones',
              Icons.notifications,
              state.hasNotificationsPermission,
              () => context.read<MonitoringBloc>().add(
                    const MonitoringPermissionRequested(PermissionType.notifications),
                  ),
            ),
            _buildPermissionTile(
              'Contactos',
              Icons.contacts,
              state.hasContactsPermission,
              () => context.read<MonitoringBloc>().add(
                    const MonitoringPermissionRequested(PermissionType.contacts),
                  ),
            ),
            _buildPermissionTile(
              'Registro de Llamadas',
              Icons.call,
              state.hasCallLogsPermission,
              () => context.read<MonitoringBloc>().add(
                    const MonitoringPermissionRequested(PermissionType.callLogs),
                  ),
            ),
            _buildPermissionTile(
              'Ubicación',
              Icons.location_on,
              state.hasLocationPermission,
              () => context.read<MonitoringBloc>().add(
                    const MonitoringPermissionRequested(PermissionType.location),
                  ),
            ),
            _buildPermissionTile(
              'Archivos',
              Icons.folder,
              state.hasStoragePermission,
              () => context.read<MonitoringBloc>().add(
                    const MonitoringPermissionRequested(PermissionType.storage),
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPermissionTile(
    String title,
    IconData icon,
    bool granted,
    VoidCallback onRequest,
  ) {
    return ListTile(
      leading: Icon(icon, color: granted ? AppColors.success : AppColors.warning),
      title: Text(title),
      trailing: granted
          ? const Icon(Icons.check_circle, color: AppColors.success)
          : TextButton(
              onPressed: onRequest,
              child: const Text('Solicitar'),
            ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Acciones Rápidas',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    Icons.notifications,
                    'Notificaciones',
                    AppColors.primary,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildActionButton(
                    Icons.contacts,
                    'Contactos',
                    AppColors.secondary,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildActionButton(
                    Icons.call,
                    'Llamadas',
                    AppColors.warning,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    Icons.location_on,
                    'Ubicación',
                    AppColors.error,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildActionButton(
                    Icons.folder,
                    'Archivos',
                    Colors.purple,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildActionButton(
                    Icons.map,
                    'Mapa',
                    Colors.teal,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color color) {
    return InkWell(
      onTap: () {
        // Navigate to specific section
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: color, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Actividad Reciente',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Center(
              child: Text(
                'Sin actividad reciente',
                style: TextStyle(color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Hace un momento';
    } else if (difference.inMinutes < 60) {
      return 'Hace ${difference.inMinutes} minutos';
    } else if (difference.inHours < 24) {
      return 'Hace ${difference.inHours} horas';
    } else {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    }
  }
}