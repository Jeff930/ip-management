<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder {
    public function run() {
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $user = Role::firstOrCreate(['name' => 'User']);

        $permissions = [
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'create-ip',
            'edit-own-ip',
            'edit-any-ip',
            'delete-ip',
            'view-roles',
            'view-logs'
        ];

        foreach ($permissions as $perm) {
            $permission = Permission::firstOrCreate(['name' => $perm]);

            if (in_array($perm, ['create-ip', 'edit-own-ip'])) {
                $user->permissions()->syncWithoutDetaching([$permission->id]);
            }

            $admin->permissions()->syncWithoutDetaching([$permission->id]);
        }
    }
}
