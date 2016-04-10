describe('clinical:hl7-resources-condition', function () {
  var server = meteor();
  var client = browser(server);

  it('Conditions should exist on the client', function () {
    return client.execute(function () {
      expect(Conditions).to.exist;
    });
  });

  it('Conditions should exist on the server', function () {
    return server.execute(function () {
      expect(Conditions).to.exist;
    });
  });

});
