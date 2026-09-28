find /data -mindepth 1 -delete
cp -a /backup/lab02/. /data/
touch /data/recovery.signal
echo "restore_command = 'cp /archive/%f %p'" >> /data/postgresql.auto.conf
echo "recovery_target_name = 'lab02_good'" >> /data/postgresql.auto.conf
echo "recovery_target_inclusive = true" >> /data/postgresql.auto.conf
echo "recovery_target_action = promote" >> /data/postgresql.auto.conf
chown -R 70:70 /data
