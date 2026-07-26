-- Allow admins to delete contact form messages
DROP POLICY IF EXISTS "Allow admin to delete inquiries" ON contact_messages;
CREATE POLICY "Allow admin to delete inquiries" ON contact_messages
  FOR DELETE TO authenticated USING (true);
